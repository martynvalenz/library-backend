import {Request, Response} from 'express';
import { makeSlug } from '../helpers/slugify';
import { Book, Category } from '../models';

export const storeBook = async(req:Request, res:Response) => {
  try {
    const {uid,...data} = req.body;
    
    const checkTitle = await Book.findOne({title:data.title});

    if(checkTitle){
      return res.status(400).json({
        success: false,
        msg: 'Book title already exists',
      });
    }
    data.slug = await makeSlug(data.title);
    data.userId = uid;
    const newBook = await Book.create(data);
    await Category.findByIdAndUpdate(data.categoryId,{
      $inc: { books: 1 }
    });
    const book = await Book.findById(newBook._id)
      .populate([
        {path:'userId',select:'id name lastName'},
        {path:'categoryId',select:'id category slug'},
      ]);

    res.send({
      book
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const editBook = async(req:Request, res:Response) => {
  try {
    const {id} = req.params;
    
    const book = await Book.findById(id)

    res.send({
      book
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const updateBook = async(req:Request, res:Response) => {
  try {
    const {id} = req.params;
    const {uid,...data} = req.body;
    
    const checkTitle = await Book.findOne({
      $and: [
        {title:data.title,_id:{$ne:id}},
      ]
    });

    if(checkTitle){
      return res.status(400).json({
        success: false,
        msg: 'Book title already exists',
      });
    }
    
    const checkCategory = await Book.findById(id).select('categoryId');
    if(checkCategory.categoryId !== data.categoryId){
      await Category.findByIdAndUpdate(checkCategory.categoryId,{
        $inc: { books: -1 }
      });
      await Category.findByIdAndUpdate(data.categoryId,{
        $inc: { books: 1 }
      });
    }
    
    data.slug = await makeSlug(data.title);
    data.userId = uid;
    const updateBook = await Book.findByIdAndUpdate(id,data);
    const book = await Book.findById(updateBook._id)
      .populate([
        {path:'userId',select:'id name lastName'},
        {path:'categoryId',select:'id category slug'},
      ]);

    res.send({
      book
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}
import {Request, Response} from 'express';
import { makeSlug } from '../helpers/slugify';
import { Category } from '../models';

export const createCategory = async(req:Request, res:Response) => {
  try {
    const {...data} = req.body;
    
    const checkCategory = await Category.findOne({category:data.category});

    if(checkCategory){
      return res.status(400).json({
        success: false,
        msg: 'Category already exists',
      });
    }
    data.slug = await makeSlug(data.category);
    const category = await Category.create(data);

    res.send({
      category
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}
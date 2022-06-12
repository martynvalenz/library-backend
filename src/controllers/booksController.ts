import {Request, Response} from 'express';
import { makeSlug } from '../helpers/slugify';
import { Book, Cart, Loan, Category, Favorite, Notification, User } from '../models';

export const getBooks = async(req:Request, res:Response) => {
  try {
    const {category,limit,page} = req.body;
    let results:any = [];

    if(category){
      results = await Book.paginate({isActive:true,categoryId:category},{limit:parseInt(limit),page:parseInt(page)});
    }
    else{
      results = await Book.paginate({isActive:true},{limit:parseInt(limit),page:parseInt(page)});
    }

    res.send({
      results
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const getBooksAdmin = async(req:Request, res:Response) => {
  try {
    const {limit,page} = req.body;

    const results = await Book.paginate({},{limit:parseInt(limit),page:parseInt(page)});

    res.send({
      results
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

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
    if(checkCategory?.categoryId !== data.categoryId){
      await Category.findByIdAndUpdate(checkCategory?.categoryId,{
        $inc: { books: -1 }
      });
      await Category.findByIdAndUpdate(data.categoryId,{
        $inc: { books: 1 }
      });
    }
    
    data.slug = await makeSlug(data.title);
    data.userId = uid;
    const updateBook = await Book.findByIdAndUpdate(id,data);
    const book = await Book.findById(updateBook?._id)
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

export const getFavorites = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;
    const favorites:any = await Favorite.find({userId:uid})
      .populate([
        {path:'bookId',select:'id title slug coverImage author year  categoryId userId isActive stock'},
      ]);

    res.send({
      favorites
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const addFavorite = async(req:Request, res:Response) => {
  try {
    const {uid,bookId} = req.body;
    const checkFavorite = await Favorite.findOne({bookId,userId:uid});
    if(checkFavorite){
      return res.status(200).json({
        msg:'The book is already in your favorites',
        color:'info',
        success:false
      });
    }

    await Favorite.create({bookId,userId:uid});
    const favorite = await Book.findById(bookId);

    res.send({
      favorite,
      msg:'The book has been added to your favorites',
      color:'positive',
      success:true
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const removeFavorite = async(req:Request, res:Response) => {
  try {
    const {uid,bookId} = req.body;
    const findFavorite = await Favorite.findOne({bookId,userId:uid});
    if(findFavorite){
      await Favorite.findOneAndRemove(findFavorite._id)
    }

    res.send({
      bookId,
      msg:'The book has been removed from your favorites',
      color:'positive',
      success:true
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const viewCart = async(req:Request, res:Response) => {
  try {
    const {userId} = req.params;
    const cart = await Cart.find({userId});
    const cartBooks = new Array<any>();
    await Promise.all(cart.map(async (obj:any) => {
      const book = await Book.findById(obj.bookId)
        .populate([
          {path:'userId',select:'id name lastName'},
          {path:'categoryId',select:'id category slug'},
        ]);
        cartBooks.push(book);
    }));
    
    const loans = await Loan.find({userId,status:'Loan'}).select('id userId bookId');
    const loanBooks = new Array<any>();
    await Promise.all(loans.map(async (obj:any) => {
      const book = await Book.findById(obj.bookId)
        .populate([
          {path:'userId',select:'id name lastName'},
          {path:'categoryId',select:'id category slug'},
        ]);
        loanBooks.push(book);
    }));

    res.send({
      cartBooks,
      loanBooks
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const clearCart = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;
    await Cart.deleteMany({userId:uid});

    res.send({
      msg:'The cart has been cleared',
      color:'positive',
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const addCart = async(req:Request, res:Response) => {
  try {
    const {userId,bookId} = req.body;

    const checkStock = await Book.findById(bookId);
    if(checkStock?.stock === 0){
      return res.status(400).json({
        msg:'The book is out of stock',
      });
    }

    const checkCart = await Cart.findOne({bookId,userId});
    if(checkCart){
      return res.status(200).json({
        msg:'The book is already in your cart',
        color:'info',
        success:false
      });
    }

    await Cart.create({bookId,userId});

    res.send({
      msg:'The book has been added to your cart',
      color:'positive',
      success:true
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const addCartFromFavorites = async(req:Request, res:Response) => {
  try {
    const {uid,bookId} = req.body;

    const checkStock = await Book.findById(bookId);
    if(checkStock?.stock === 0){
      return res.status(400).json({
        msg:'The book is out of stock',
      });
    }

    const checkCart = await Cart.findOne({bookId,userId:uid});
    if(checkCart){
      return res.status(200).json({
        msg:'The book is already in your cart',
        color:'info',
        success:false
      });
    }

    await Cart.create({bookId,userId:uid});

    res.send({
      msg:'The book has been added to your cart',
      color:'positive',
      success:true
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const removeBookFromCart = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;
    const {bookId} = req.params;
    await Cart.deleteOne({bookId,userId:uid});

    res.send({
      success:true,
      bookId
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const getLoans = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;

    const loans = await Loan.find({userId:uid,status:'Loan'}).select('id userId bookId');
    const loanBooks = new Array<any>();
    await Promise.all(loans.map(async (obj:any) => {
      const book = await Book.findById(obj.bookId)
        .populate([
          {path:'userId',select:'id name lastName'},
          {path:'categoryId',select:'id category slug'},
        ]);
        loanBooks.push(book);
    }));
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const requestLoan = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;
    const checkNotification = await Notification.findOne({userId:uid});

    if(checkNotification){
      return res.status(200).json({
        msg:'You have already requested a loan, wait for the admin to approve it',
        color:'orange',
        success:false
      });
    }

    const user = await User.findById(uid).select('id name lastName');

    await Notification.create({userId:uid,text:`The user ${user.name} ${user.lastName} has requested a loan`});

    res.send({
      msg:'The request has been sent',
      color:'positive',
      success:true
    })
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const acceptRequest = async(req:Request, res:Response) => {
  try {
    const {notificationId} = req.params;
    const notification = await Notification.findById(notificationId);
    console.log(notification);
    const selectedUser = await User.findById(notification.userId).select('id name lastName');
    await Notification.findByIdAndRemove(notificationId);

    res.send({
      selectedUser
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const confirmLoan = async(req:Request, res:Response) => {
  try {
    const {uid,userId,cart} = req.body;

    const loanedBooks = new Array<any>();
    let outOfStockCount = 0;
    await Promise.all(cart.map(async (obj:any) => {
      const book:any = await Book.findById(obj.id)
        .populate([
          {path:'userId',select:'id name lastName'},
          {path:'categoryId',select:'id category slug'},
        ]);

      if(book.stock > 0 && book.isActive){
        await Book.findByIdAndUpdate(book._id,{$inc: { stock: -1 }});
        await Loan.create({userId,bookId:book._id,authorizedId:uid});
        await Cart.deleteOne({bookId:book._id,userId});
        loanedBooks.push(book);
      }
      else{
        outOfStockCount++;
      }
    }));

    if(outOfStockCount > 0){
      res.send({
        loanedBooks,
        msg:"One or more books don't have enough stock or are not active",
        color:'warning',
      });
    }
    else{
      res.send({
        loanedBooks,
        msg:'All books have been loaned',
        color:'positive',
      });
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const turInBook = async(req:Request, res:Response) => {
  try {
    const {bookId} = req.params;
    const {uid,userId} = req.body;

    await Loan.findOneAndUpdate({bookId,userId,status:'Loan'},{status:'Returned',receivedId:uid});
    await Book.findByIdAndUpdate(bookId,{$inc: { stock: 1 }});

    res.send({
      msg:'The book has been returned',
      color:'positive',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const turInAllBooks = async(req:Request, res:Response) => {
  try {
    const {uid,userId} = req.body;
    const loans = await Loan.find({userId,status:'Loan'});
    await Promise.all(loans.map(async (obj:any) => {
      await Book.findByIdAndUpdate(obj.bookId,{$inc: { stock: 1 }});
      await Loan.findOneAndUpdate({bookId:obj.bookId,userId,status:'Loan'},{status:'Returned',receivedId:uid});
    }));

    res.send({
      msg:'The books have been returned',
      color:'positive',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}
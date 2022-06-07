import { Response,Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const adminPermission = async(req:Request,res:Response, next:any) => {
  const {uid} = req.body;

  try {
    const user = await User.findById(uid);

    if(user.role !== 'Admin'){
      return res.status(401).json({
        msg:'This action is only authorized for admins'
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg:'This action is only authorized for admins',
      resetUser:true
    });
  }
}
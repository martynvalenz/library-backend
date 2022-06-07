import { Response,Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const validateJWT = async(req:Request,res:Response, next:any) => {
  const token:string = req.header('token') as string;
  const jwtKey:any = process.env.JWT_KEY

  try {
    if(!token){
      return res.status(401).json({
        msg:'No token on header'
      });
    }

    const {uid}:any = jwt.verify(token, jwtKey);
    const user = await User.findById(uid);

    if(!user){
      return res.status(401).json({
        msg:'Not valid token or the user does not exist',
      });
    }

    // Verify if user is active
    if(!user.isActive || !user.hasAccess){
      return res.status(401).json({
        msg:'Not valid token - user without access to the platform',
      });
    }

    req.body.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg:'Not valid token',
      resetUser:true
    });
  }
}
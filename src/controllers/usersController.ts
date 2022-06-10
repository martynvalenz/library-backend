import {Request, Response} from 'express';
import { User } from '../models';
import { signUp } from './authController';
import bcrypt from 'bcrypt';

export const storeUser = async(req:Request, res:Response) => {
  try {
    signUp(req,res);

  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const getAccount = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;

    const user = await User.findById(uid);

    res.send({
      user
    })

  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}

export const updateUser = async(req:Request, res:Response) => {
  try {
    const {id} = req.params;
    const {...data} = req.body;

    const findUser = await User.findOne(
      { 
        $and: [
          {email:data.email,_id:{$ne:id}},
        ]
      }
    );

    if(findUser){
      return res.status(400).json({
        findUser,
        msg:'The email is already being used by an existing user'
      });
    }

    const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`
    data.initials = initials;
    if(data.password){
      const salt = bcrypt.genSaltSync();
      data.password = bcrypt.hashSync(data.password, salt);

      await User.findByIdAndUpdate(id, {
        name:data.name,
        lastName:data.lastName,
        email:data.email,
        initials:data.initials,
        hasAccess:data.hasAccess,
        password:data.password,
        role:data.role,
      });
    }
    else{
      await User.findByIdAndUpdate(id, {
        name:data.name,
        lastName:data.lastName,
        email:data.email,
        initials:data.initials,
        hasAccess:data.hasAccess,
        role:data.role,
      });
    }
    const user = await User.findById(id);

    res.send({
      user
    })

  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}
import {Request, Response} from 'express';
import { User } from '../models';
import { signUp } from './authController';

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

    const user = await User.findByIdAndUpdate(id, data);

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
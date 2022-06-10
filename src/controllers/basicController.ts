import {Request, Response} from 'express';

export const functioner = async(req:Request, res:Response) => {
  try {
    
  } catch (error) {
    res.status(500).json({
      message: 'Error in the server',
      error
    });
  }
}
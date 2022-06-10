import {Request, Response} from 'express';
import validator from './validate';

export const registerRequest = (req:Request, res:Response, next:any) => {
  const validationRule = {
    "name": "required",
    "lastName": "required",
    "email":"required",
    "password":"required|min:6",
  }
  validator(req.body, validationRule, {}, (err:any, status:any) => {
    if (!status) {
      res.status(400)
      .send({
        success: false,
        msg: 'Cannot save the user, check the fields',
        errors: err.errors
      });
      return;
    }
    next();
  });
}

export const loginRequest = (req:Request, res:Response, next:any) => {
  const validationRule = {
    "email":"required",
    "password":"required|min:6",
  }
  validator(req.body, validationRule, {}, (err:any, status:any) => {
    if (!status) {
      res.status(400)
      .send({
        success: false,
        msg: 'Credentials do not match our records',
        errors: err.errors
      });
      return;
    }
    next();
  });
}

export const updateUserRequest = (req:Request, res:Response, next:any) => {
  const validationRule = {
    "name": "required",
    "lastName": "required",
    "email":"required"
  }
  validator(req.body, validationRule, {}, (err:any, status:any) => {
    if (!status) {
      res.status(400)
      .send({
        success: false,
        msg: 'Cannot save the user, check the fields',
        errors: err.errors
      });
      return;
    }
    next();
  });
}

export const categoryRequest = (req:Request, res:Response, next:any) => {
  const validationRule = {
    "category":"required",
  }
  validator(req.body, validationRule, {}, (err:any, status:any) => {
    if (!status) {
      res.status(400)
      .send({
        success: false,
        msg: 'Error on form validation',
        errors: err.errors
      });
      return;
    }
    next();
  });
}

export const storeBookRequest = (req:Request, res:Response, next:any) => {
  const validationRule = {
    "title":"required",
    "author":"required",
    "coverImage":"required",
    "year":"required",
    "stock":"required|numeric|min:0",
    "categoryId":"required",
  }
  validator(req.body, validationRule, {}, (err:any, status:any) => {
    if (!status) {
      res.status(400)
      .send({
        success: false,
        msg: 'Error on form validation',
        errors: err.errors
      });
      return;
    }
    next();
  });
}
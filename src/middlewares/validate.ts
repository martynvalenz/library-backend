import Validator from 'validatorjs';

const validator = (body:any, rules:any, customMessages:any, callback:any) => {
  const validation = new Validator(body, rules, customMessages);
  validation.setAttributeNames({
    lastName:'last name',
    coverImage:'cover image',
    categoryId:'category',
  })
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

export default validator;
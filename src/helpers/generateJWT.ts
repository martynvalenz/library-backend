import jwt from 'jsonwebtoken';

export const generateJWT = (uid:'') => {
  return new Promise((resolve, reject) => {
    const payload = {uid};
    const jwtKey:any = process.env.JWT_KEY;

    jwt.sign(payload, jwtKey, {
      expiresIn:'10d'
    }, (error, token) => {
      if(error){
        console.log(error);
        reject('No se pudo generar el token');
      }
      else {
        resolve(token);
      }
    })
  })
}
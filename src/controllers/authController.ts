import {Request, Response} from 'express';
import randomColor from '../helpers/getRandomColors';
import { Book, Category, User } from '../models';
import bcrypt from 'bcrypt';
import { generateJWT } from '../helpers/generateJWT';
import luxon,{DateTime} from 'luxon';

export const createSecretAdmin = async(req:Request, res:Response) => {
  const {...data} = req.body
  try {
    const findUser = await User.findOne({email:data.email});

    if(findUser){
      return res.status(400).json({
        msg:'The email already exists!'
      });
    }

    // If no errors resume user creation
    const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`
    data.color = await randomColor();
    const lastLogin = new Date();

    Object.assign(data,{initials,lastLogin,role:'Admin'});
    const salt = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(data.password, salt);

    const newUser = await User.create(data);

    res.send({
      newUser
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const signUp = async(req:Request, res:Response) => {
  const {...data} = req.body
  try {
    const findUser = await User.findOne({email:data.email});

    if(findUser){
      return res.status(400).json({
        msg:'The email already exists!'
      });
    }

    // If no errors resume user creation
    const initials = `${data.name.charAt(0)}${data.lastName.charAt(0)}`
    data.color = await randomColor();
    const lastLogin = new Date();
    let role = 'User';
    if(data.createAdmin){
      role = 'Admin';
    }

    Object.assign(data,{initials,lastLogin,role});
    const salt = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(data.password, salt);

    const user = await User.create(data);

    // Generate JWT
    const token = await generateJWT(user.id);

    res.send({
      token,
      user
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const login = async(req:Request, res:Response) => {
  const {email, password} = req.body;
  const timezone = req.header('timezone');

  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        'msg':'The credentials are not in our database.'
      });
    }

    if(!user.isActive || !user.hasAccess){
      return res.status(404).json({
        msg:'The user has no access to the platform'
      });
    }

    const validPassword = await bcrypt.compareSync(password, user.password);
    if(!validPassword){
      return res.status(400).json({
        msg:'The credentials are not in our database.'
      });
    }

    const now:any = DateTime.now();
    const lastLogin = DateTime.fromISO(now, { zone: timezone });
    await User.findByIdAndUpdate(user.id,{lastLogin});

    // Generate JWT
    const token = await generateJWT(user.id);

    res.send({
      token,
      name:user.name,
      lastName:user.lastName
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const refreshToken = async(req:Request, res:Response) => {
  // User uid
  const {uid} = req.body
  const timezone = req.header('timezone');

  try {
    // Generar nuevo JWT
    const token = await generateJWT(uid);

    const now:any = DateTime.now();
    const date = DateTime.fromISO(now, { zone: timezone }).toFormat('yyyy-MM-dd');
    const time = DateTime.fromISO(now, { zone: timezone }).toFormat('HH:mm:ss');
    await User.findByIdAndUpdate(uid,{lastLogin:`${date} ${time}`});

    res.send({
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}

export const userData = async(req:Request, res:Response) => {
  try {
    const {uid} = req.body;
    const timezone = req.header('timezone');
    const now:any = DateTime.now();
    const date = DateTime.fromISO(now, { zone: timezone }).toFormat('yyyy-MM-dd');
    const time = DateTime.fromISO(now, { zone: timezone }).toFormat('HH:mm:ss');
    await User.findByIdAndUpdate(uid,{lastLogin:`${date} ${time}`});
    const user = await User.findById(uid).select('initials name lastName email color role');

    const categories = await Category.find().sort({category:1})
    const books = await Book.find()
      .sort({title:1})
      .populate([
        {path:'userId',select:'id name lastName'},
        {path:'categoryId',select:'id category slug'},
      ]);

    let users:any = [];

    if(user.role === 'Admin'){
      users = await User.find().select('id initials name lastName email color loans hasAccess role').sort({name:1});
    }

    res.send({
      user,
      categories,
      books,
      users,
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg:'Server Error, contact support'
    });
  }
}
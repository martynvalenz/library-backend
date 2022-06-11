import mongoose from 'mongoose';

const dbMongo = async() => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION!)
    console.log('✅  MongoDB online');
  } catch (error) {
    console.log(error)
    throw new Error('🚫 Error on database connection');
  }
}

export default dbMongo;
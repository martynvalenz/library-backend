import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbMongo from './config/dbConnect';

// routes
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';

// MongoDB connection
const dbConnection = async() => {
  try {
    await dbMongo();
    // await dbMysql.authenticate();
  } catch (error:any) {
    throw new Error(error);
  }
}

dotenv.config();
const app: Express = express();
const port = process.env.PORT;
// app.use(json());
app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
dbConnection();

// Routes imports
app.get('/', (req: Request, res: Response) => {
  res.send('Error: No Access');
});


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);


app.listen(port,() => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
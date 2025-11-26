import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import './db/pool.js';
import googleAuthRoute from './routes/googleAuth.js';
import productRouter from './routes/productRoutes.js';

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOptions));


// basic configuratioins
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// app.get('/protectedRoute', authenticateUser, (req, res)=>{
//     res.status(200).json({message: "user trusted"});
// })

// Auth routes
app.use('/auth', googleAuthRoute);
app.use('/products', productRouter);

export default app;
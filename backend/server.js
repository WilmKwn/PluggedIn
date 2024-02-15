import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';

// env setup
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/user', userRoute);
app.use('/post', postRoute);

// connect to db
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Successfully connected to database');
    app.listen(process.env.PORT, () => {
        console.log("Listening on port", process.env.PORT);
    });
}).catch(err => {
    console.log(err);
});
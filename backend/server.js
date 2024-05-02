import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import WebSocket, {WebSocketServer} from 'ws';

import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import songRoute from './routes/songRoute.js';

// env setup
import dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/conversation', conversationRoute);
app.use('/song', songRoute);

// connect to db
mongoose.connect(process.env.MONGODB_URL).then((client) => {
    console.log('Successfully connected to database');
    
    const postStream = mongoose.connection.collection('posts').watch();
    const postWss = new WebSocketServer({ port: 8080 });
    postWss.on('connection', (ws) => {
        console.log("Client connected");

        postStream.on('change', (change) => {
            ws.send(JSON.stringify(change));
        });
        ws.on('close', () => {
            console.log("Client disconnected");
        });
    });
    halhafhfasklfalkfhsaklfalkfsjlkfsaj

    const convoStream = mongoose.connection.collection('conversations').watch();
    const convoWss = new WebSocketServer({ port: 8181 });
    convoWss.on('connection', (ws) => {
        console.log("Client connected");

        convoStream.on('change', (change) => {
            ws.send(JSON.stringify(change));
        });
        ws.on('close', () => {
            console.log("Client disconnected");
        });
    });

    const userStrean = mongoose.connection.collection('users').watch();
    const userWss = new WebSocketServer({ port: 8282 });
    userWss.on('connection', (ws) => {
        console.log("Client connected");

        userStrean.on('change', (change) => {
            ws.send(JSON.stringify(change));
        });
        ws.on('close', () => {
            console.log("Client disconnected");
        });
    });
    
    app.listen(process.env.PORT, () => {
        console.log("Listening on port", process.env.PORT);
    });
}).catch(err => {
    console.log(err);
});
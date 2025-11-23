import path from 'path';
import { ENV } from './lib/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';


const limiter = rateLimit({
    windowMs: 1000, // 1 minute
    max: process.env.NODE_ENV === 'test' ? 3 : 100, // limit each IP to 3 requests per windowMs in test, 100 otherwise
    message: 'Too many requests, please try again later'
});


app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());

const PORT = ENV.PORT || 3000;

app.use('/api', limiter);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}

if(process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log('Server running on port', PORT)
    connectDB()
  });
}

import path from 'path';
import { ENV } from './lib/env.js';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = ENV.PORT || 3000;;

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
    connectDB()
});

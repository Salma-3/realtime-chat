import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if(!mongoUri) {
            throw new Error('MONGO_URI is not set');
        }
        const conn = await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Server', conn.connection.host)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1);
    }
}
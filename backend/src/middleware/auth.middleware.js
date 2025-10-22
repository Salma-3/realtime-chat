import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const user = await User.findById(decoded.userId);

        if(!user) {
            return  res.status(401).json({ message: 'Not authorized' });
        }

        req.user = user
        next();
    } catch (error) {
        console.error('Error authorizing user:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
}
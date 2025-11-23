import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { ENV } from '../lib/env.js';


export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookie

    const token = socket.handshake.headers.cookie
      ?.split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];
    
      if(!token) {
        console.log('Socket connection rejected: No token provided');
        return next(new Error('Unauthorized - No token provided'));
      }

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      if(!decoded) {
        console.log('Socket connection rejected: Invalid token');
        return next(new Error('Unauthorized - Invalid token'));
      }

      const user = await User.findById(decoded.userId);
      if(!user) {
        console.log('Socket connection rejected: User not found')
        return next(new Error('User not found'))
      }

      socket.user = user;
      socket.userId = user.id.toString();

      console.log('Socket authenticated for user:', user.fullName, user.id)

      next();
  } catch (error) {
    console.error('Error socketAuthMiddleware', error)
    return next(new Error('Something went wrong'))
  }
}
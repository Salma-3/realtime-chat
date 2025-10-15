import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;
    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const emailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!emailRgx.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);
        // Save user to DB
        const newUser = new User({ email, password: hashedPassword, fullName });
        await newUser.save();

        if(newUser) {
            generateToken(newUser.id, res)
        }
        //TODO: send welcome email
        
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body; 
    try {
        if(!email || !password) return res.status(400).json({ message: 'All the fields are required!'})
        
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials'});
        }

        const passwordMatch = await bcrypt.verify(password, user.password);
        if(!passwordMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
         
        generateToken(user.id, res)

        

        return res.status(200).json(user)
    } catch (error) {
        console.log('Error in signup controller:', error.message)
        return res.status(500).json({ message: error.message })
    }
}
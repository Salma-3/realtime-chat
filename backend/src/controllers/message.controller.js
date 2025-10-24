import Message from '../models/message.js';
import User from '../models/user.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId }
        }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Error in getAllContacts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
    
}

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user.id
        const { id: userToChatId } = req.params; 

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userToChatId },
                { sender: userToChatId, receiver: myId }
            ]
        })

        return res.status(200).json(messages);

    } catch (error) {
        console.error('Error in getMessagesByUserId:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        let imageUrl;

        if(image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // TODO:emit socket event to receiver 

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error in sendMessage:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user.id.toString();

        // find distinct user ids from messages where logged in user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPartnersIds = messages.map(msg => msg.senderId.toString() === loggedInUserId ? msg.receiverId : msg.senderId);
        const uniqueChatPartnersIds = [...new Set(chatPartnersIds.map(id => id.toString()))];

        const chatPartners = await User.find({
            _id: { $in: uniqueChatPartnersIds }
        });
        return res.status(200).json(chatPartners);
    } catch (error) {
        console.error('Error in getChatPartners:', error)
        res.status(500).json({ message: 'Server Error' });
    }
}
import express from 'express';

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Signup Endpoin')
})

router.get('/login', (req, res) => {
    res.send('Login Endpoin')
})

router.get('/logout', (req, res) => {
    res.send('Logout Endpoin')
})


export default router;
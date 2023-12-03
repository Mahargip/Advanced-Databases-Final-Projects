const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    res.json({ token });
}

function logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

function me(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        res.status(200).json({ user: { userId: decoded.userId } });
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

async function register(req, res) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = await User.create({ name, email, password });

        const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { login, logout, me, register };
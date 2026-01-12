const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        console.log('Register attempt:', { email, name });

        const existingUser = await db.users.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ error: 'User already exists' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.users.insert({
            email,
            password: hashedPassword,
            name
        });

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token, user: { id: user._id, email, name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.users.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

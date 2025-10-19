const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUrl).then(() => console.log('User DB connected'));

app.post('/register', async (req, res) => {
    try {
        const u = new User(req.body);
        await u.save();
        res.status(201).json(u);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/', (req, res) => res.send('User Service'));
app.get('/list', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.listen(3101, () => console.log('User service listening on 3101'));
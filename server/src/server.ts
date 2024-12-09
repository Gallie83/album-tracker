import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri: string = process.env.MONGODB_URI || "";

// MongoDB connection setup
mongoose.connect(uri)
.then(() => console.log("Connected to DB"))
.catch(console.error);

// Import Schemas from models folder
const User = require('../models/User');

app.get('/users', async(req, res) => {
    try {
        const users = await User.find();
        res.setHeader('Content-Type', 'application/json');
        res.json(users)
        console.log(users)
    } catch (error) {
        res.status(500).json({ error: (error as Error).message})
    }
})

app.post('/user/new', async(req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            usersAlbums: req.body.usersAlbums,
            userSavedAlbums: req.body.userSavedAlbums,
            groups: req.body.groups,
        })
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({error: (error as Error).message})
    }
})

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
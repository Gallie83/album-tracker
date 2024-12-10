import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// AWS Cognito import
import { Issuer, generators } from 'openid-client';
import session from 'express-session';


dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri: string = process.env.MONGODB_URI || "";

let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wMTwWN3bb');
    client = new issuer.Client({
        client_id: '6hpe4kcbkvf9hogee7kg0bo1h3',
        client_secret: '<client secret>',
        redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

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
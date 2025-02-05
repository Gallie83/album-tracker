import express, { Express } from 'express';
import session from 'express-session'
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Group } from '../models/Group'
import { checkAuth } from './middleware/auth';
import { initializeCognitoClient } from './config/cognito';

import nodemailer from 'nodemailer';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
}));

initializeCognitoClient();

// Environment Variables
const email_username = process.env.EMAIL_USERNAME
const email_password = process.env.EMAIL_PASSWORD
const uri = process.env.MONGODB_URI || "";

// Route for getting usersAlbums + usersSavedAlbums
app.get('/user-albums', checkAuth, async (req,res) => {
    try {   
        // Ensure user is authenticated
        if(!req.session.userInfo) { 
            console.log("TRSU:", req.session.userInfo)
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        const cognitoId = req.session.userInfo.sub;
        const user = await User.findOne({cognitoId});
        
        if(!user) {
            res.status(404).json({ message: 'Cannot find user' });
            return 
        }

        res.json({usersAlbums: user.usersAlbums, savedAlbums: user.usersSavedAlbums})
    } catch (error) {
        console.log("USERS ALBUMS ERROR:",error);
    }
})

// Route to add to users Save/Rated albums lists
app.post('/save-album', checkAuth, async (req,res): Promise<void> => {
    const { albumId, rating, title, artist } = req.body;
    
    try {
        // Ensure user is authenticated
        if(!req.session.userInfo) { 
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        // Set cognitoId and then search for user
        const cognitoId = req.session.userInfo.sub

        const user = await User.findOne({ cognitoId });

        if(!user) {
            res.status(404).json({ message: 'Cannot find user' });
            return 
        }

        // Check if user already has album in usersAlbums, if rating is 0 then search usersSavedAlbums
        const album = rating === 0 
        ? user.usersSavedAlbums.find(album => album.id === albumId) 
        : user.usersAlbums.find(album => album.id === albumId); 

        if (album) {
            // Return message if album already exists
            res.status(200).json({ message: 'This album is already in your list.' });
            return;
        }

        // If album is not found, add it to the user's list
        rating === 0 
        ? user.usersSavedAlbums.push({
            id: albumId,
            title,
            artist,
        })
        : user.usersAlbums.push({
            id: albumId,
            title,
            artist,
            dateListened: new Date(),
            // Set rating as null in case user doesn't want to add a rating
            rating: rating !== undefined ? rating : null,
        }) 

        await user.save();
        res.status(200).json({
            message: rating === 0 ? 'Album saved' : 'Album added to Your Albums',
            album
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to remove an album from a list
app.delete('/remove-album', checkAuth, async (req,res) => {
    const { albumId, rating } = req.body;
    
    try {
        // Ensure user is authenticated
        if(!req.session.userInfo) { 
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        // Set cognitoId and then search for user
        const cognitoId = req.session.userInfo.sub

        const user = await User.findOne({ cognitoId });

        if(!user) {
            res.status(404).json({ message: 'Cannot find user' });
            return 
        }

        // Check which list to remove item from and then save user 
        if(rating === 0) {
            user.usersSavedAlbums.pull({id: albumId});
            console.log("SAVEDALBUMS:", user.usersSavedAlbums)
        } else {
            user.usersAlbums.pull({id: albumId});
        }
        await user.save()

        res.status(200).json({message: 'Album deleted'})
        
    } catch {
        console.log("error")
        res.status(500).json({message: 'Failure deleting'})
    }
})

// Route to update album rating
app.put('/update-rating', checkAuth, async (req,res) => {
    const { albumId, rating } = req.body;

    try {
        // Ensure user is authenticated
        if(!req.session.userInfo) { 
            res.status(401).json({error: 'User not authenticated'})
            return 
        }
        
        // Set cognitoId and then search for user
        const cognitoId = req.session.userInfo.sub

        const user = await User.findOne({ cognitoId });

        if(!user) {
            res.status(404).json({ message: 'Cannot find user' });
            return 
        }

        const album = user.usersAlbums.find(album => album.id === albumId); 

        if(album) {
            album.rating = rating;
            await user.save();
            res.status(200).json({message: 'Rating updated'})
        } else {
            res.status(404).json({message: 'Album not found in list'})
            return
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error while updating rating'})
    }
})

// Route to create a new listening group
app.post('/create-group', async(req,res) => {
    const { groupName, description, isPrivate, cognitoId } = req.body;

    try {
        // Create Group with users cognitoId as first member Id
        const newGroup = new Group({
            title: groupName,
            description: description,
            private: isPrivate,
            members: [cognitoId],
            albums: [],
        });

        await newGroup.save()

        res.status(201).json({message: 'Group created!', group: newGroup});
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ 
            message: 'Error creating group:', error
        });
    }
})

// Route for fetching User's Groups
app.get('/:cognitoId/groups', async(req, res) => {
    try {   
        const {cognitoId} = req.params;

        // if (!cognitoId) {
        //     res.status(400).json({ message: 'No user ID provided' });
        //     return;
        // }

        const userGroups = await Group.find({ members: cognitoId})

        res.status(200).json(userGroups)
    } catch (error) {
        console.log("Error fetching users groups:", error);
    }
})

// Route for adding an album to a users group
app.post('/groups/add-album/:groupId', async(req,res) => {
    const { groupId } = req.params;
    const { title, artist, hashId } = req.body;

    try{
        // Find Group by it's Id 
        const group = await Group.findById(groupId);
        if(!group) {
            res.status(404).json({ message: 'Group not found'})
            return;
        }
        
        // Create new album object
        const album = {
            title,
            artist,
            hashId,
            ratings: [],
            dateListened: null,
        }

        // Add album to group.albums and save group
        group.albums.push(album);
        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.error('Error adding album to group:', error);
        res.status(500).json({ 
            message: 'Error adding album to group:', error
        });
    }
})

// Send email with feedback from users
app.post("/submit-feedback", async (req,res) => {
    const { feedback, email } = req.body;

    try { 
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail", // or your email provider's SMTP service
            auth: {
            user: email_username, // Your email address
            pass: email_password, // App password or OAuth token
            },
        });

        // Email content
        const mailOptions = {
            from: email_username, 
            to: email_username, 
            subject: `New Feedback for VYNYL`,
            text: `
            You received feedback:
            Email: ${email}
            Message: ${feedback}
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Feedback submitted successfully!');
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).send("Failed to submit feedback");
    }
})

// MongoDB connection setup
mongoose.connect(uri)
.then(() => console.log("Connected to DB"))
.catch(console.error);

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
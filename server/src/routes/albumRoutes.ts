import { Router } from 'express';
import { User } from '../../models/User';
import { checkAuth } from '../middleware/auth';

// Initialize Router
const router = Router();

// Route for getting usersAlbums + usersSavedAlbums
router.get('/user-albums', checkAuth, async (req,res) => {
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
router.post('/save-album', checkAuth, async (req,res): Promise<void> => {
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
router.delete('/remove-album', checkAuth, async (req,res) => {
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
router.put('/update-rating', checkAuth, async (req,res) => {
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
});

export default router;
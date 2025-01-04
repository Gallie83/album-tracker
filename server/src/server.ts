import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose, { models } from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
// AWS Cognito import
import session from 'express-session';
import { Issuer, generators, Client } from 'openid-client';
import { Session, SessionData} from 'express-session';

dotenv.config();

const app: Express = express();


app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment Variables
const uri: string = process.env.MONGODB_URI || "";
const user_pool_id: string = process.env.AMAZON_USER_POOL_ID || "";
const client_id: string = process.env.AMAZON_CLIENT_ID || "";
const client_secret: string = process.env.AMAZON_CLIENT_SECRET || "";


let client: Client;

// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover(`https://cognito-idp.us-east-1.amazonaws.com/${user_pool_id}`);
    console.log("Issuer:", issuer);
    client = new issuer.Client({
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        redirect_uris: ['http://localhost:5000/callback/'],
        response_types: ['code']
    });
};
initializeClient().then(() => {console.log('Client:', client)}).catch(console.error);

// Session Middleware
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

interface CustomSession extends Session {
    userInfo?: any;
    nonce?: string;
    state?: string;
    returnUrl: string;
}

// AuthenticatedRequest includes the custom session properties
interface AuthenticatedRequest extends Request {
    session: Session & Partial<SessionData & CustomSession>;
    isAuthenticated?: boolean;
}

// Middleware to check if a user is authenticated
const checkAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const typedReq = req as AuthenticatedRequest; 
    typedReq.isAuthenticated = !!typedReq.session?.userInfo; 
    next();
};

// Home Route
app.get('/', checkAuth, (req: Request, res: Response) => {
    const typedReq = req as AuthenticatedRequest; 
    res.send({
        isAuthenticated: typedReq.isAuthenticated,
        userInfo: typedReq.session?.userInfo || null
    });
});


// Login Route
app.get('/login', (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    const nonce = generators.nonce();
    const state = generators.state();
    
    typedReq.session.nonce = nonce;
    typedReq.session.state = state;

    
    // Assign return URL or default to '/profile'
    const returnUrl = req.query.returnUrl
    ? `http://localhost:5173${req.query.returnUrl}`
    : 'http://localhost:5173/profile';
    typedReq.session.returnUrl = returnUrl as string;
    
    const authUrl = client.authorizationUrl({
        response_type: 'code',
        scope: 'openid email phone profile',
        state,
        nonce,
        redirect_uri: 'http://localhost:5000/callback/'
    });
    
    res.redirect(authUrl);
});

// Callback Route
app.get('/callback', async (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    try {
        const params = client.callbackParams(typedReq);

        
        const tokenSet = await client.callback(
            'http://localhost:5000/callback/',
            params,
            {
                nonce: typedReq.session.nonce as string,
                state: typedReq.session.state as string,
            }
        );
        
        if (!tokenSet.access_token) {
            throw new Error('Access token is missing');
        }
        
        const userInfo = await client.userinfo(tokenSet.access_token);
        typedReq.session.userInfo = userInfo;

        console.log("TypedReq USER INFO:",typedReq.session.userInfo)

        console.log("USER MODEL:", User);

        // Check MongoDb if user exists, if not, create new
        let user = await User.findOne({ cognitoId: userInfo.sub });

        if(!user) {     
            console.log("NEW USER")
            try {
                user = new User({
                    cognitoId: userInfo.sub,
                    username: userInfo.preferred_username,
                    email: userInfo.email,
                    usersAlbums: [],
                    userSavedAlbums: [],
                    groups: [] 
                });
                await user.save();
            } catch ( error ) {
                console.error('Error creating user:', error)
            }
        }
        
        // Redirect to original return URL or default to '/profile'
        const returnUrl = typedReq.session.returnUrl || 'http://localhost:5173/profile';
        res.redirect(returnUrl);
        
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('http://localhost:5173/profile');
    }  
});

// Logout Route
app.get('/logout', (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    typedReq.session.destroy((err) => {
        if(err) { 
            console.error('Session destruction failed:', err); 
            return res.status(500).send('Failed to destroy session');
        }
    });
    const logoutUrl = `https://${user_pool_id.toLowerCase().replace('_', '')}.auth.us-east-1.amazoncognito.com/logout?client_id=${client_id}&logout_uri=${encodeURIComponent('http://localhost:5173/')}`;
    res.redirect(logoutUrl);
});

// Route for getting usersAlbums + usersSavedAlbums
app.get('/user-albums', checkAuth, async (req,res) => {
    const typedReq = req as AuthenticatedRequest;
    try {   
        // Ensure user is authenticated
        if(!typedReq.session.userInfo) { 
            console.log("TRSU:", typedReq.session.userInfo)
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        const cognitoId = typedReq.session.userInfo.sub;
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
    const typedReq = req as AuthenticatedRequest;

    const { albumId, rating, title, artist } = typedReq.body;
    
    try {
        // Ensure user is authenticated
        if(!typedReq.session.userInfo) { 
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        // Set cognitoId and then search for user
        const cognitoId = typedReq.session.userInfo.sub

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
    const typedReq = req as AuthenticatedRequest;

    const { albumId, rating } = typedReq.body;
    
    try {
        // Ensure user is authenticated
        if(!typedReq.session.userInfo) { 
            res.status(401).json({error: 'User not authenticated'})
            return 
        }

        // Set cognitoId and then search for user
        const cognitoId = typedReq.session.userInfo.sub

        const user = await User.findOne({ cognitoId });

        if(!user) {
            res.status(404).json({ message: 'Cannot find user' });
            return 
        }

        // Check which list to remove item from and then save user 
        if(rating === 0) {
            user.usersSavedAlbums.pull({id: albumId});
        } else {
            user.usersAlbums.pull({id: albumId});
        }
        await user.save()
        
    } catch {
        console.log("error")
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
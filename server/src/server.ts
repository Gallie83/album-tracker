import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// AWS Cognito import
import session from 'express-session';
import { Issuer, generators, Client } from 'openid-client';
import { Session, SessionData} from 'express-session';


dotenv.config();

const app: Express = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri: string = process.env.MONGODB_URI || "";
const user_pool_domain: string = process.env.AMAZON_USER_POOL_DOMAIN || "";

let client: Client;

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
    const typedReq = req as AuthenticatedRequest; // Explicitly type req
    typedReq.isAuthenticated = !!typedReq.session?.userInfo; // Use optional chaining for safety
    next();
};

// Home Route
app.get('/', checkAuth, (req: Request, res: Response) => {
    const typedReq = req as AuthenticatedRequest; // Type req once in the handler
    res.send({
        isAuthenticated: typedReq.isAuthenticated,
        userInfo: typedReq.session?.userInfo || null, // Safely access session.userInfo
    });
});


// Login Route
app.get('/login', (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    const nonce = generators.nonce();
    const state = generators.state();

    typedReq.session.nonce = nonce;
    typedReq.session.state = state;

    // Assign return URL or default to '/'
    const returnUrl = req.query.returnUrl || '/';
    typedReq.session.returnUrl = returnUrl as string;

    const authUrl = client.authorizationUrl({
        scope: 'openid email',
        state,
        nonce,
        redirect_uri: 'http://localhost:5173/'
    });

    res.redirect(authUrl);
});

// Callback Route
app.get('/callback', async (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    try {
        const params = client.callbackParams(typedReq);
    
        const tokenSet = await client.callback(
            'https://d84l1y8p4kdic.cloudfront.net',
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

        // Redirect to original return URL or default to '/'
        const returnUrl = typedReq.session.returnUrl || '/';
        res.redirect(returnUrl);
    
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
    
    // Logout route
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction failed:', err);
            }
        });
        const logoutUrl = `https://<user pool domain>/logout?client_id=6hpe4kcbkvf9hogee7kg0bo1h3&logout_uri=http://localhost:5173/`;
        res.redirect(logoutUrl);
    });
    
 
});

// Logout Route
app.get('/logout', (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    typedReq.session.destroy((err) => {
        if(err) { console.error('Session destruction failed:', err); }
    });
    const logoutUrl = `https://${user_pool_domain}/logout?client_id=6hpe4kcbkvf9hogee7kg0bo1h3&logout_uri=https://d84l1y8p4kdic.cloudfront.net`;
    res.redirect(logoutUrl);
});

// MongoDB connection setup
mongoose.connect(uri)
.then(() => console.log("Connected to DB"))
.catch(console.error);

// Import Schemas from models folder
// const User = require('../models/User');

// app.get('/users', async(req, res) => {
//     try {
//         const users = await User.find();
//         res.setHeader('Content-Type', 'application/json');
//         res.json(users)
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message})
//     }
// })

// app.post('/user/new', async(req, res) => {
//     try {
//         const user = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//             usersAlbums: req.body.usersAlbums,
//             userSavedAlbums: req.body.userSavedAlbums,
//             groups: req.body.groups,
//         })
//         const savedUser = await user.save();
//         res.json(savedUser);
//     } catch (error) {
//         res.status(500).json({error: (error as Error).message})
//     }
// })

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
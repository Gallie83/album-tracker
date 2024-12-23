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


app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies and credentials
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    console.log('Session Nonce:', typedReq.session.nonce);
    console.log('Session State:', typedReq.session.state);

    
    // Assign return URL or default to '/'
    const returnUrl = req.query.returnUrl
    ? `http://localhost:5173${req.query.returnUrl}`
    : 'http://localhost:5173/';
    typedReq.session.returnUrl = returnUrl as string;
    
    const authUrl = client.authorizationUrl({
        response_type: 'code',
        scope: 'openid email phone profile',
        state,
        nonce,
        redirect_uri: 'http://localhost:5000/callback/'
    });
    console.log('Authorization URL:', authUrl);
    
    res.redirect(authUrl);
});

// Callback Route
app.get('/callback', async (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    console.log('Callback received:', typedReq.query);
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
        console.log('User info:', typedReq.session.userInfo)
        
        // Redirect to original return URL or default to '/'
        console.log('Session Return URL:', typedReq.session.returnUrl);
        const returnUrl = typedReq.session.returnUrl || 'http://localhost:5173/';
        res.redirect(returnUrl);
        
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('http://localhost:5173/profile');
    }  
});

// Logout Route
app.post('/logout', (req, res) => {
    const typedReq = req as AuthenticatedRequest;
    typedReq.session.destroy((err) => {
        if(err) { 
            console.error('Session destruction failed:', err); 
            return res.status(500).send('Failed to destroy session');
        }
    });
    const logoutUrl = `https://${user_pool_id.toLowerCase().replace('_', '')}.auth.us-east-1.amazoncognito.com/logout?client_id=${client_id}&logout_uri=${encodeURIComponent('http://localhost:5173/')}`;
    console.log("logOutUrl:", logoutUrl)
    res.redirect(logoutUrl);
});

// MongoDB connection setup
mongoose.connect(uri)
.then(() => console.log("Connected to DB"))
.catch(console.error);

// Import Schemas from models folder
// const User = require('../models/User');

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
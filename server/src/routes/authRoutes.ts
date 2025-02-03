import { Router } from 'express';
import { User } from '../../models/User';
import { checkAuth } from '../middleware/auth';
import { generators } from 'openid-client';
import { client } from '../config/cognito'

// AWS Cognito import
import session from 'express-session';

// Environment Variables
const user_pool_id: string = process.env.AMAZON_USER_POOL_ID || "";
const client_id: string = process.env.AMAZON_CLIENT_ID || "";


// Initialize Router
const router = Router();

// Session Middleware
router.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));


// Home Route
router.get('/', checkAuth, (req, res) => {
    res.send({
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session?.userInfo || null
    });
});

// Login Route
router.get('/login', (req, res) => {
    
    const nonce = generators.nonce();
    const state = generators.state();
    
    req.session.nonce = nonce;
    req.session.state = state;

    
    // Assign return URL or default to '/profile'
    const returnUrl = req.query.returnUrl
    ? `http://localhost:5173${req.query.returnUrl}`
    : 'http://localhost:5173/profile';
    req.session.returnUrl = returnUrl as string;
    
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
router.get('/callback', async (req, res) => {
    
    try {
        const params = client.callbackParams(req);

        
        const tokenSet = await client.callback(
            'http://localhost:5000/callback/',
            params,
            {
                nonce: req.session.nonce as string,
                state: req.session.state as string,
            }
        );
        
        if (!tokenSet.access_token) {
            throw new Error('Access token is missing');
        }
        
        const userInfo = await client.userinfo(tokenSet.access_token);

        // Ensure required field - sub, is present
        if (!userInfo.sub) {
            throw new Error('User info is missing required field: sub');
        }
        req.session.userInfo = {
            sub: userInfo.sub,
            email: userInfo.email, // Optional
            preferred_username: userInfo.preferred_username, // Optional
          };

        console.log("TypedReq USER INFO:",req.session.userInfo)

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
        const returnUrl = req.session.returnUrl || 'http://localhost:5173/profile';
        res.redirect(returnUrl);
        
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('http://localhost:5173/profile');
    }  
});

// Logout Route
router.get('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if(err) { 
            console.error('Session destruction failed:', err); 
            return res.status(500).send('Failed to destroy session');
        }
    });
    const logoutUrl = `https://${user_pool_id.toLowerCase().replace('_', '')}.auth.us-east-1.amazoncognito.com/logout?client_id=${client_id}&logout_uri=${encodeURIComponent('http://localhost:5173/')}`;
    res.redirect(logoutUrl);
});

export default router;
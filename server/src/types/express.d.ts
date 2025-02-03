import { Session, SessionData } from 'express-session';

// Extends Express Request type
declare module 'express-session' {
    interface SessionData {
            userInfo?: {
                sub: string;
                email?: string;
                preferred_username?: string;
              };    
            nonce?: string;
            state?: string;
            returnUrl: string;
        };
    }

declare module 'express-serve-static-core' {
    interface Request {
        session: Session & SessionData;
        isAuthenticated?: boolean;
    }
}
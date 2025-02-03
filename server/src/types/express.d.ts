import { Session, SessionData } from 'express-session';

// Extends Express Request type
declare module 'express-serve-static-core' {
    interface Request {
        session: Session & Partial<SessionData> & {
            userInfo?: any;    
            nonce?: string;
            state?: string;
            returnUrl: string;
        };
        isAuthenticated?: boolean;
    }
}
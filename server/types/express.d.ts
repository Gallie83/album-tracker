import { Session, SessionData } from 'express-session';

// interface UserInfo {
//     sub: string;
//     email?: string;
//     preferred_username?: string;
// }

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
      }
    }
    
    declare module 'express' {
      interface Request {
        session: Session & SessionData;
        isAuthenticated?: boolean;
      }
    }

// export type { UserInfo }
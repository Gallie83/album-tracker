import { Request, Response, NextFunction } from 'express';

// Checks if a user is authenticated
export const checkAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => { 
    req.isAuthenticated = !!req.session?.userInfo; 

    if(!req.isAuthenticated) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    next();
};
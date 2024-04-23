import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the 'Authorization' header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // if there isn't any token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.body.user = user;

        next(); // pass the execution off to whatever request the client intended
    });
};
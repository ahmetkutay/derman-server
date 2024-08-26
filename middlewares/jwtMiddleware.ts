import {Request, Response, NextFunction} from 'express';
import JWT from '../helpers/jwtHelper';

declare module 'express-serve-static-core' {
    interface Request {
        user?: object;
    }
}

/**
 * Verifies the access token provided in the request header.
 * If the token is missing or invalid, it returns an error response.
 *
 * @param {Request} req - The request object containing the headers.
 * @param {Response} res - The response object used to send the error response.
 * @param {NextFunction} next - The next middleware function to be called.
 * @returns {Response | void} - If the token is missing, returns a 401 error response with the message "Access token not found".
 */
function verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    const jwtHelper = new JWT();

    try {
        const decodedToken = jwtHelper.verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default verifyToken;
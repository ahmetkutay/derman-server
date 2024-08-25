import {Request, Response, NextFunction} from 'express';
import JWT from '../helpers/jwtHelper';

// Extend Request interface to include user property
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
 *                             If the token is invalid, returns a 401 error response with the message "Invalid token".
 *                             If the token is valid, sets the `user` property of the request object and calls the next middleware function.
 */
function verifyToken(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization; // Get the token from the request header
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token assuming "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Access token not found' });
    }

    const jwtHelper = new JWT();

    try {
        const decodedToken = jwtHelper.verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decodedToken; // Set the user property in the request object
        next(); // Proceed to the next middleware function
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default verifyToken;
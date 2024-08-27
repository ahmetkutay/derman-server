import { Request, Response, NextFunction } from 'express';
import User from '../model/userModel';

const isValidUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username },
                { phone: username }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default isValidUser;
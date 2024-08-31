import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Tweet from '../model/postModel';

const verifyPost = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid Post ID' });
    }

    try {
        const post = await Tweet.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        next();
    } catch (error) {
        console.error('Error verifying post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default verifyPost;
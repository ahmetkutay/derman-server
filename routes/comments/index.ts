import {Router, Request, Response} from 'express';
import {createComment,deleteComment,updateComment} from "../../services/commentService";
import {IComment} from "../../model/commentModel";
import { Types } from 'mongoose';
import verifyPost from "../../middlewares/verifyPostMiddleware";
import replyRoute from './reply/index';
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the post comment page!');
});

router.get('/:postId', verifyPost,(req: Request, res: Response) => {
    const postId = req.params.postId;
    res.send(postId);
});

router.post('/:postId',verifyPost, async (req: Request, res: Response) => {
    const {text} = req.body
    const {postId} = req.params
    const tweet: Types.ObjectId = new Types.ObjectId(postId);
    // @ts-ignore
    const {_id} = req.user;

    try {
        const postData : Partial<IComment> = {
            text: text,
            author: _id,
            tweet: tweet
        }
        const result = await createComment(postData)
        if(result._id){
            return res.status(201).send(result._id)
        }
        return res.status(400).send(result)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:postId/:commentId',verifyPost, async (req: Request, res: Response) => {
    const {text} = req.body
    const {postId,commentId} = req.params
    const tweet: Types.ObjectId = new Types.ObjectId(postId);
    // @ts-ignore
    const {_id} = req.user;
    try {
        const commentData : Partial<IComment> = {
            text: text,
            author: _id,
            tweet: tweet
        }
        const result = await updateComment(commentId,commentData)
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.delete('/:postId/:commentId',verifyPost, async (req: Request, res: Response) => {
    const {commentId} = req.params;
    try {
        const result = await deleteComment(commentId);
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get('/:postId/:commentId',verifyPost, replyRoute);


export default router;
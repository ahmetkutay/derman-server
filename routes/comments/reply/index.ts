import {Router, Request, Response} from 'express';
import {IReply} from "../../../model/replyModel";
import {Types} from "mongoose";
import {createReply,deleteReply,updateReply} from "../../../services/replyService";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the reply comment page!');
});

router.post('/', async (req: Request, res: Response) => {
    const {text} = req.body
    const {commentId} = req.params
    const replyId: Types.ObjectId = new Types.ObjectId(commentId);
    // @ts-ignore
    const {_id} = req.user;

    try {
        const postData : Partial<IReply> = {
            content: text,
            author: _id,
            commentedId: replyId
        }
        const result = await createReply(postData)
        if(result._id){
            return res.status(201).send(result._id)
        }
        return res.status(400).send(result)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:replyId', async (req: Request, res: Response) => {
    const {text} = req.body
    const {commentId,replyId} = req.params
    const postCommentId: Types.ObjectId = new Types.ObjectId(commentId);
    // @ts-ignore
    const {_id} = req.user;

    try {
        const postData : Partial<IReply> = {
            content: text,
            author: _id,
            commentedId: postCommentId
        }
        const result = await updateReply(replyId,postData)
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete('/:replyId', async (req: Request, res: Response) => {
    const {replyId} = req.params

    try {
        const result = await deleteReply(replyId)
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        return res.status(500).send(error);
    }
});

export default router;
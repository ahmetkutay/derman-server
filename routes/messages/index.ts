import {Router, Request, Response} from 'express';
import {createPost, deletePost, getAllPosts, updatePost} from '../../services/postService'
import {ITweet} from "../../model/postModel";
const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const posts = await getAllPosts();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {text,category} = req.body
    // @ts-ignore
    const {_id} = req.user;

    try {
        const postData : Partial<ITweet> = {
            text: text,
            author: _id,
            category: category
        }
        const result = await createPost(postData)
        if(result._id){
            return res.status(201).send(result._id)
        }
        return res.status(400).send(result)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/', async (req: Request, res: Response) => {
    const {text,category,postId} = req.body
    // @ts-ignore
    const {_id} = req.user;
    try {
        const postData : Partial<ITweet> = {
            text: text,
            author: _id,
            category: category
        }
        const result = await updatePost(postId,postData)
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.delete('/', async (req: Request, res: Response) => {
    // @ts-ignore
    const {postId} = req.body;
    try {
        const result = await deletePost(postId);
        if(!result){
            return res.status(404).send(result);
        }
        return res.status(200).send(result._id)
    } catch (error) {
        res.status(500).send('Server error');
    }
});

export default router;
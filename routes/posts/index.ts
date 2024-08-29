import {Router, Request, Response, text} from 'express';
import {createPost} from '../../services/postService'
import {ITweet} from "../../model/postModel";
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the post page!');
});

router.post('/', async (req: Request, res: Response) => {
    const {text,_id,category} = req.body
    // @ts-ignore
    const {userId} = req.user;
    try {
        const postData : Omit<ITweet, any> = {
            text: text,
            author: userId,
            category: category
        }
        const result = await createPost(postData)
        if(result._id){
            res.status(201).send(result._id)
        }
        res.status(400).send(result)
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/', async (req: Request, res: Response) => {
    try {
        console.log("put")
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.delete('/', async (req: Request, res: Response) => {
    try {
        console.log("delete")
    } catch (error) {
        res.status(500).send('Server error');
    }
});

export default router;
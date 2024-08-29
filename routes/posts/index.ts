import {Router, Request, Response} from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the post page!');
});

router.post('/', async (req: Request, res: Response) => {
    const {text,_id} = req.body
    try {
        console.log("post")
    } catch (error) {
        res.status(500).send('Server error');
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
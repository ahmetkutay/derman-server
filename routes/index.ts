import {Router, Request, Response} from 'express';
import authRouter from './auth/index'

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the home page!');
});

router.use('/auth', authRouter);

export default router;
import {Router, Request, Response} from 'express';
import resetPasswordRouter from './resetPassword'

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the user page!');
});

router.use('/reset-password', resetPasswordRouter);


export default router;
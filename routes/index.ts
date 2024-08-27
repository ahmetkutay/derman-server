import {Router, Request, Response} from 'express';
import authRouter from './auth/index'
import userRouter from './user/index'
import isValidUser from "../middlewares/isValidUser";
import verifyToken from "../middlewares/jwtMiddleware";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the home page!');
});

router.use('/auth', authRouter);
router.use('/user',verifyToken,userRouter)

export default router;
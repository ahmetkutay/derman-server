import {Router, Request, Response} from 'express';
import authRouter from './auth/index'
import userRouter from './user/index'
import postRouter from "./posts/index";
import commentRouter from "./comments/index";
import docRouter from "./documentation/index"
import verifyToken from "../middlewares/jwtMiddleware";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the home page!');
});

router.use('/auth', authRouter);
router.use('/user',verifyToken,userRouter)
router.use('/post',verifyToken, postRouter)
router.use('/doc', docRouter)
router.use('/comment',verifyToken,commentRouter)

export default router;
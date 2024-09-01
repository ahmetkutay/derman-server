import {Router, Request, Response} from 'express';
import authRouter from './auth/index'
import userRouter from './user/index'
import postRouter from "./posts/index";
import commentRouter from "./comments/index";
import docRouter from "./documentation/index"
import verifyToken from "../middlewares/jwtMiddleware";
import passport from "passport";

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the home page!');
});

router.use('/auth', authRouter);
router.use('/user',passport.authenticate('jwt', { session: false }),userRouter)
router.use('/post',passport.authenticate('jwt', { session: false }), postRouter)
router.use('/doc', docRouter)
router.use('/comment',passport.authenticate('jwt', { session: false }),commentRouter)



export default router;
import {Router} from 'express';
import JWT from '../../helpers/jwtHelper';
import {ajvMiddleware,checkExistingUser} from "../../middlewares/registerValidation";
import {createUser,hashPassword} from "../../services/authService";
import {IUser} from "../../model/userModel";

const router = Router();

router.post(
    '/',
    ajvMiddleware,
    checkExistingUser,
    async (req, res, next) => {
        const jwtHelper = new JWT();
        try{
            const userData: Omit<IUser, any> = {
                username: req.body.username as string,
                first_name: req.body.first_name as string,
                last_name: req.body.last_name as string,
                email: req.body.email as string,
                password: await hashPassword(req.body.password) as string,
                phone: req.body.phone || '' as string,
                birthdate: req.body.birthdate || '' as string,
                posts: [],
                messages: [],
                comments: []
            };

            const user = await createUser(userData);
            const accessTokenPayload = {userId: user._id, username: user.username};
            const accessToken = jwtHelper.generateAccessToken(accessTokenPayload);
            const refreshTokenPayload = {userId: user._id, username: user.username};
            const refreshToken = jwtHelper.generateRefreshToken(refreshTokenPayload);

            const result = {
                user: user._id,
                accessToken:accessToken,
                refreshToken:refreshToken
            };
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
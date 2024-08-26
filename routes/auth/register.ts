import {Router} from 'express';
import JWT from '../../helpers/jwtHelper';
import {generateRandomText} from "../../helpers/customHelpers";
import {ajvMiddleware,checkExistingUser} from "../../middlewares/registerValidation";
import {createUser,hashPassword} from "../../services/authService";
import {IUser} from "../../model/userModel";

const router = Router();

router.post(
    '/',
    ajvMiddleware,
    checkExistingUser,
    async (req, res, next) => {
        try{
            const randomText = generateRandomText(6);

            const userData: Omit<IUser, any> = {
                username: req.body.username as string,
                first_name: req.body.first_name as string,
                last_name: req.body.last_name as string,
                email: req.body.email as string,
                password: await hashPassword(req.body.password) as string,
                phone: req.body.phone || '' as string,
                birthdate: req.body.birthdate || '' as string,
                gender: req.body.gender as string,
                verified: false as boolean,
                verificationToken: randomText,
                posts: [],
                messages: [],
                comments: []
            };

            const user = await createUser(userData);
            const result = {
                user: user._id,
            };
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
import {Router} from 'express';
import JWT from '../../helpers/jwtHelper';
// import checkExistingUserForLogin from '../../helpers/loginValidation';

const router = Router();

router.post(
    '/',
    async (req, res, next) => {
        const jwtHelper = new JWT();
        try {
            return res.status(200).json({message: 'login'});
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
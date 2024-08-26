import {Router} from 'express';
import JWT from '../../helpers/jwtHelper';

const router = Router();

router.post(
    '/',
    async (req, res, next) => {
        const jwt = new JWT()
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            const decoded = jwt.verifyToken(token as string);
            if (decoded) {
                res.clearCookie('token');
                res.status(401).json({message: `Token not found`});
            }
            res.status(200).json({message: 'Logged out successfully'});
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
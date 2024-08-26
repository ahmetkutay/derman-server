import {Router} from 'express';
import {confirmVerificationToken} from "../../services/authService";

const router = Router();

router.post(
    '/',
    async (req, res, next) => {
        try {
            const confirmResponse = await confirmVerificationToken(req.body.token,req.body.id)
            if(confirmResponse)
                return res.status(200).json('Verified');
            return res.status(400).json(`Token is wrong`);
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
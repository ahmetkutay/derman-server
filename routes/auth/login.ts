import {Router} from 'express';
import JWT from '../../helpers/jwtHelper';
import checkExistingUserForLogin from '../../helpers/loginValidation';
import {validatePassword} from "../../services/authService";
import {Types} from "mongoose";
import User from "../../model/userModel";

const router = Router();

router.post(
    '/',
    async (req, res, next) => {
        const jwtHelper = new JWT();
        try {
            const userData = req.body === undefined ? undefined : req.body.username !== undefined ? req.body.username : req.body.email !== undefined ? req.body.email : req.body.mobileNumber;
            const loggedUserData = await checkExistingUserForLogin(userData);
            if (loggedUserData === undefined) {
                return res.status(401).json({message: 'User not found!'});
            }
            const userPassword = req.body.password;
            // @ts-ignore
            const isPasswordValid = await validatePassword(userPassword, loggedUserData.password);
            if (!isPasswordValid) {
                return res.status(401).json({error: 'Invalid password'});
            }
            // @ts-ignore
            const accessTokenPayload = {userId: loggedUserData._id, username: loggedUserData.username};
            const accessToken = jwtHelper.generateAccessToken(accessTokenPayload);
            const refreshToken = jwtHelper.generateRefreshToken(accessTokenPayload);
            // @ts-ignore
            if(jwtHelper.isRefreshTokenExpired(loggedUserData.refreshToken)){
                // @ts-ignore
                const userId: Types.ObjectId = new Types.ObjectId(loggedUserData._id as string);
                await User.updateOne({ _id: userId}, { $set: { refreshToken: refreshToken } });
            }
            // @ts-ignore
            const refreshedToken = loggedUserData.refreshToken === '' ? refreshToken : loggedUserData.refreshToken;
            const result = {
                accessToken,
                refreshedToken
            };
            return res.status(200).json(result);
        } catch (err) {
            return next(err);
        }
    }
);

export default router;
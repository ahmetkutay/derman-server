import express, {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import User from '../../model/userModel';
import {generateRandomText, sendMail} from "../../helpers/customHelpers";
import {comparePassword} from "../../services/authService";

const router = express.Router();

router.post('/code', async (req: Request, res: Response) => {
    const {_id} = req.body;

    try {
        const user = await User.findOne({_id});
        if (!user) {
            return res.status(404).send('User not found');
        }

        const token = generateRandomText(6)
        user.verificationToken = token
        await user.save();
        await sendMail(user.email, 'Password Reset', `The token for the reset your password: ${token}`);
        res.status(200).send('Password reset code sent');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {_id,token,password, newPassword} = req.body;

    try {
        const user = await User.findOne({_id});

        if (!user) {
            return res.status(404).send('User not found');
        }
        if(user.verificationToken === token && await comparePassword(password,user.password)){
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(newPassword, salt);
            await user.save();
        } else
            res.status(401).send('Invalid password');
        res.status(200).send('Password successfully reset');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

export default router;
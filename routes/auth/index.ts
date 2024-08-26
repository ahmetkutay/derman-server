import express from 'express';
import registerUser from './register';
import loginUser from './login';
import verificationUser from "./verificationUser";

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', loginUser);
router.use('/verification', verificationUser);

export default router;
import express from 'express';
import registerUser from './register';
import loginUser from './login';
import verificationUser from "./verificationUser";
import logoutUser from './logout';
import isValidUser from "../../middlewares/isValidUser";

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', isValidUser , loginUser);
router.use('/verification', verificationUser);
router.use('/logout', logoutUser);

export default router;
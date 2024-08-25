import express from 'express';
import registerUser from './register';
import loginUser from './login';

const router = express.Router();

router.use('/register', registerUser);
router.use('/login', loginUser);

export default router;
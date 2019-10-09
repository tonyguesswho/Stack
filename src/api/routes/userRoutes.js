import express from 'express';
import authController from '../controllers/authController'

const userRouter = express.Router();

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);

export default userRouter;

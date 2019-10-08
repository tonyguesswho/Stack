import express from 'express';
import questionRouter from './routes/questionRoutes'
import userRouter from './routes/userRoutes'

const router = express.Router();

router.use('/questions', questionRouter);
router.use('/users', userRouter);

export default router;

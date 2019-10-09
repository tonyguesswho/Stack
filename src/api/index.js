import express from 'express';
import questionRouter from './routes/questionRoutes'
import userRouter from './routes/userRoutes'
import searchRouter from './routes/searchRoutes'

const router = express.Router();

router.use('/questions', questionRouter);
router.use('/users', userRouter);
router.use('/search', searchRouter)

export default router;

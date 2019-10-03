import express from 'express';
import questionRouter from './routes/question'

const router = express.Router();

router.use('/questions', questionRouter);

export default router;

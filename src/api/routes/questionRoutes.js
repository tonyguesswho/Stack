import express from 'express';
import questionController from '../controllers/questionController';
import authController from '../controllers/authController';

const questionRouter = express.Router();

questionRouter
  .route('/')
  .post(authController.authMiddleware, questionController.createQuestion)
  .get(questionController.getAllQuestions);

questionRouter.route('/:id').get(questionController.getQuestion);
questionRouter
  .route('/:questionId/answer')
  .post(authController.authMiddleware, questionController.postAnswer);

questionRouter
  .route('/:questionId/vote')
  .post(authController.authMiddleware, questionController.voteQuestion);

questionRouter
  .route('/:questionId/subscribe')
  .post(authController.authMiddleware, questionController.subscribe);

questionRouter
  .route('/:questionId/unsubscribe')
  .delete(authController.authMiddleware, questionController.unSubscribe);

export default questionRouter;

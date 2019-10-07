import express from 'express';
import questionController from './../controllers/questionController'

const questionRouter = express.Router();

questionRouter.route('/').get(questionController.getAllQuestions);

export default questionRouter;

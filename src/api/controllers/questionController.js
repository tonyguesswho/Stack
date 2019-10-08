import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import Question from '../models/questionModels';
import Answer from '../models/answerModels';
import APIFeatures from '../../utils/apiFeatures';

exports.createQuestion = catchAsync(async (req, res, next) => {
  const { title, body } = req.body;
  const user = req.user._id;
  const question = await Question.create({ title, body, user });
  res.status(201).json({
    status: 'success',
    data: {
      question
    }
  });
});

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Question.find().populate('answers'),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();
  const questions = await features.query;
  res.status(200).json({
    status: 'success',
    results: questions.length,
    data: {
      questions
    }
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate('answers');
  if (!question) {
    return next(new AppError('Question not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      question
    }
  });
});

exports.postAnswer = catchAsync(async (req, res, next) => {
  const { body } = req.body;
  const user = req.user._id;
  const { questionId } = req.params;
  const answer = await Answer.create({
    body,
    user,
    question: questionId
  });
  res.status(201).json({
    status: 'success',
    data: {
      answer
    }
  });
});

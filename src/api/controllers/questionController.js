import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import Question from '../models/questionModel';
import Answer from '../models/answerModel';
import Vote from '../models/voteModel';
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
    Question.find()
      .populate({
        path: 'answers',
        select: ['body', 'user']
      })
      .populate({
        path: 'votes',
        select: ['type', 'user']
      }),
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
  const question = await Question.findById(req.params.id)
    .populate({
      path: 'answers',
      select: ['body', 'user']
    })
    .populate({
      path: 'votes',
      select: ['type', 'user']
    });
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

exports.voteQuestion = catchAsync(async (req, res, next) => {
  const { type } = req.body;
  const user = req.user._id;
  const { questionId } = req.params;
  const myquestion = await Question.findOne({ _id: questionId, user });
  let vote = null;
  if (myquestion) {
    return next(new AppError('Users can not vote on their questions', 401));
  }
  const myvote = await Vote.findOne({ question: questionId, user });

  if (myvote && myvote.type === type) {
    await Vote.findByIdAndDelete(myvote._id);
  } else if (myvote) {
    vote = await Vote.findOneAndUpdate(
      { user, question: questionId },
      { type },
      { new: true, runValidators: true }
    );
  } else {
    vote = await Vote.create({ type, user, question: questionId });
  }
  res.status(200).json({ status: 'success', data: { vote } });
});

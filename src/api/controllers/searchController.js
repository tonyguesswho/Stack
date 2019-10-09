import catchAsync from '../../utils/catchAsync';
import Question from '../models/questionModel';
import Answer from '../models/answerModel';
import User from '../models/userModel';
import AppError from '../../utils/appError';

const getResults = async (model, searchTerm) => {
  const results = await model.find({
    $text: {
      $search: searchTerm
    }
  });
  return results;
};

exports.search = catchAsync(async (req, res, next) => {
  if (Object.keys(req.query).length > 1) {
    return next(new AppError('Invalid search query', 400));
  }
  let results;
  const { question, answer, user } = req.query;
  if (question) results = await getResults(Question, question);
  if (answer) results = await getResults(Answer, answer);
  if (user) results = await getResults(User, user);
  res.status(200).json({
    status: 'success',
    data: {
      results
    }
  });
});

import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Answer must belong to a user']
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Answer must belong to a question'],
  }
});

answerSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});
const Answer = mongoose.model('Answer', answerSchema);

export default Answer;

import mongoose from 'mongoose';
import Subscription from '../models/subScriptionModel';
import notify from '../../utils/notification';

const answerSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Body is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Answer must belong to a user']
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Answer must belong to a question']
  }
});

answerSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});
answerSchema.index({ body: 'text' });

answerSchema.set('toJSON', {
  transform: (doc, final) => {
    delete final.__v;
  }
});

answerSchema.post('save', async function() {
  const subscriptions = await Subscription.find({
    question: this.question
  })
    .populate('user')
    .populate('question');
  if (subscriptions.length > 0) {
    subscriptions.forEach(subscribtion => {
      const message = `Check out this new answer for the quesion with Title: ${subscribtion.question.title}`;
      notify(subscribtion.user.email, 'New Answer', message);
    });
  }
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;

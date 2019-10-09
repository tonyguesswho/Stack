import mongoose from 'mongoose';

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
answerSchema.index({ body: 'text'});

answerSchema.set('toJSON', {
  transform: (doc, final) => {
    delete final.__v;
  }
});
const Answer = mongoose.model('Answer', answerSchema);

export default Answer;

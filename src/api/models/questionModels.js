import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Body is required']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Question must belong to a user']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtual: true }
  }
);
questionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

questionSchema.virtual('answers', {
  ref: 'Answer',
  foreignField: 'question',
  localField: '_id'
});

const Question = mongoose.model('Question', questionSchema);

export default Question;

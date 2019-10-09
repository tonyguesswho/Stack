import mongoose from 'mongoose';

const subscribtionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question'
  }
});

subscribtionSchema.set('toJSON', {
  transform: (doc, sub) => {
    delete sub.__v;
  }
});

subscribtionSchema.index({ question: 1, user: 1 }, { unique: true });

const Subscription = mongoose.model('Subscription', subscribtionSchema);

export default Subscription;

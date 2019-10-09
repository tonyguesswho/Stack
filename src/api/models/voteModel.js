import mongoose from 'mongoose';
import Question from '../models/questionModel';

const voteSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Voting choice is required'],
    trim: true,
    enum: ['up', 'down'],
    lowercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vote must belong to a user']
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Vote must belong to a question']
  }
});

voteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: ['name']
  });
  next();
});

voteSchema.statics.calcUpVotes = async function(questionId) {
  const upVoteStat = await this.aggregate([
    {
      $match: { question: questionId, type: 'up' }
    },
    {
      $group: {
        _id: '$question',
        totalVote: { $sum: 1 }
      }
    }
  ]);
  if (upVoteStat.length > 0) {
    await Question.findByIdAndUpdate(questionId, {
      upVotesTotal: upVoteStat[0].totalVote
    });
  } else {
    await Question.findByIdAndUpdate(questionId, {
      upVotesTotal: 0
    });
  }
};

voteSchema.statics.calcDownVotes = async function(questionId) {
  const downVoteStat = await this.aggregate([
    {
      $match: { question: questionId, type: 'down' }
    },
    {
      $group: {
        _id: '$question',
        totalVote: { $sum: 1 }
      }
    }
  ]);
  if (downVoteStat.length > 0) {
    await Question.findByIdAndUpdate(questionId, {
      downVotesTotal: downVoteStat[0].totalVote
    });
  } else {
    await Question.findByIdAndUpdate(questionId, {
      downVotesTotal: 0
    });
  }
};

voteSchema.post('save', function() {
  this.constructor.calcUpVotes(this.question);
  this.constructor.calcDownVotes(this.question);
});

voteSchema.pre(/^findOneAnd/, async function(next) {
  this.voteDoc = await this.findOne();
  next();
});

voteSchema.post(/^findOneAnd/, async function() {
  await this.voteDoc.constructor.calcUpVotes(this.voteDoc.question);
  await this.voteDoc.constructor.calcDownVotes(this.voteDoc.question);
});
const Vote = mongoose.model('Vote', voteSchema);

export default Vote;

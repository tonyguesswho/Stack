import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../api/models/userModel';
import Question from '../api/models/questionModel';
import Answer from '../api/models/answerModel';
import app from '../server';

let token;
let questionId;
let token1;

chai.use(chaiHttp);
describe('Voting on questions', () => {
  before(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    const user = await User.create({
      name: 'madiba',
      password: 'Password',
      confirmPassword: 'Password',
      email: 'sample2@gmail.com'
    });
    const question = await Question.create({
      title: 'title 1',
      body: 'question body',
      user: user._id
    });
    const answer = await Answer.create({
      body: 'answer',
      user: user._id,
      question: question._id
    });
  });
  describe('POST: /api/v1/search', () => {
    it('should search questions', async () => {
      const res = await chai.request(app).get(`/api/v1/search?question=body`);
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.results[0].body).to.equal('question body');
      expect(res.body.data.results[0].title).to.equal('title 1');
    });
    it('should search answers', async () => {
      const res = await chai.request(app).get(`/api/v1/search?answer=answer`);
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.results[0].body).to.equal('answer');
    });
    it('should search users', async () => {
      const res = await chai.request(app).get(`/api/v1/search?user=madiba`);
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.results[0].name).to.equal('madiba');
      expect(res.body.data.results[0].email).to.equal('sample2@gmail.com');
    });
    it('should throw error if search param is invalid', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/search?user=madiba&answer=ok`);
      expect(res).to.have.status(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Invalid search query');
    });
  });
});

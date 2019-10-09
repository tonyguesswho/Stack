import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../api/models/userModel';
import Question from '../../api/models/questionModel';
import Answer from '../../api/models/answerModel';
import app from '../../server';

let token;
let questionId

chai.use(chaiHttp);
describe('Posting Answer', () => {
  before(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});
    const user = await chai
      .request(app)
      .post('/api/v1/users/signup')
      .send({
        name: 'madiba',
        password: 'Password',
        confirmPassword: 'Password',
        email: 'sample1@gmail.com'
      });
    token = user.body.data.token;
    const question = await Question.create({
      title: 'title 1',
      body: 'question body',
      user: user.body.data.user._id
    });
    questionId = question._id;
  });
  describe('POST: /api/v1/question/:id/answer', () => {
    it('should answer a question', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/answer`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          body: 'my answer'
        });
      expect(res).to.have.status(201);
      expect(res.body.status).to.equal('success');
    });
    it('should throw if token is invalid', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/answer`)
        .set({
          Authorization: 'Bearer invalidtoken'
        })
        .send({
          body: 'answer'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Invalid Token');
    });
    it('should throw if Authorization is missing', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/answer`)
        .send({
          body: 'answer'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Authorization Required');
    });
    it('should throw if body is missing', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/answer`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({});
      expect(res).to.have.status(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Body is required');
    });
  });
});

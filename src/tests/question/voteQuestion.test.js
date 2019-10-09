import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../api/models/userModel';
import Question from '../../api/models/questionModel';
import app from '../../server';

let token;
let questionId;
let token1;

chai.use(chaiHttp);
describe('Voting on questions', () => {
  before(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    const user1 = await User.create({
      name: 'madiba',
      password: 'Password',
      confirmPassword: 'Password',
      email: 'sample2@gmail.com'
    });
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
    const user1Login = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({
        password: 'Password',
        email: 'sample2@gmail.com'
      });
    token1 = user1Login.body.data.token;
    token = user.body.data.token;
    const question = await Question.create({
      title: 'title 1',
      body: 'question body',
      user: user1._id
    });
    questionId = question._id;
  });
  describe('POST: /api/v1/question/:id/vote', () => {
    it('should upvote a question', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          type: 'up'
        });
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.vote.type).to.equal('up');
    });
    it('should throw if token is invalid', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .set({
          Authorization: 'Bearer invalidtoken'
        })
        .send({
          type: 'down'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Invalid Token');
    });
    it('should throw if Authorization is missing', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .send({
          type: 'up'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Authorization Required');
    });
    it('should throw if type is missing', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({});
      expect(res).to.have.status(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Voting choice is required');
    });
    it('should throw if user upvotes their question', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .set({
          Authorization: `Bearer ${token1}`
        })
        .send({
          type: 'up'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal(
        'Users can not vote on their questions'
      );
    });
    it('should successfully switch vote', async () => {
      const res = await chai
        .request(app)
        .post(`/api/v1/questions/${questionId}/vote`)
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          type: 'down'
        });
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data.vote.type).to.equal('down');
    });
    it('should successfully remove vote', async () => {
        const res = await chai
          .request(app)
          .post(`/api/v1/questions/${questionId}/vote`)
          .set({
            Authorization: `Bearer ${token}`
          })
          .send({
            type: 'down'
          });
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.vote).to.equal(null);
      });
  });
  
});

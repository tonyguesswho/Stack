import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../api/models/userModel';
import Question from '../../api/models/questionModel';
import app from '../../server';

let token;

chai.use(chaiHttp);
describe('Question creation', () => {
  before(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
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
  });
  describe('POST: /questions', () => {
    it('should create question', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/questions')
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          title: 'question title',
          body: 'question body'
        });
      expect(res).to.have.status(201);
      expect(res.body.status).to.equal('success');
    });
    it('should throw if token is invalid', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/questions')
        .set({
          Authorization: 'Bearer invalidtoken'
        })
        .send({
          title: 'question title',
          body: 'question body'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Invalid Token');
    });
    it('should throw if Authorization is missing', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/questions')
        .send({
          title: 'question title',
          body: 'question body'
        });
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Authorization Required');
    });
    it('should throw if body is missing', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/questions')
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          title: 'question title'
        });
      expect(res).to.have.status(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Body is required');
    });
    it('should throw if title is missing', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/questions')
        .set({
          Authorization: `Bearer ${token}`
        })
        .send({
          body: 'question body'
        });
      expect(res).to.have.status(400);
      expect(res.body.status).to.equal('fail');
      expect(res.body.message).to.equal('Title is required');
    });
  });
});

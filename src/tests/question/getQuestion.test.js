import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Question from '../../api/models/questionModel';
import User from '../../api/models/userModel';
import app from '../../server';

let questionId;
chai.use(chaiHttp);
describe('Get questions', () => {
  before(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    const user = new User({
      name: 'madiba',
      password: 'Password',
      confirmPassword: 'Password',
      email: 'sample1@gmail.com'
    });
    await user.save();
    const questions = await Question.insertMany([
      {
        title: 'title 1',
        body: 'question body',
        user: user._id
      },
      {
        title: 'a',
        body: 'question body2',
        user: user._id
      }
    ]);
    questionId = questions[0]._id;
  });
  describe('GET: /questions', () => {
    it('should get all questions', async () => {
      const res = await chai.request(app).get('/api/v1/questions');
      expect(res).to.have.status(200);
      expect(res.body.results).to.equal(2);
    });
    it('should get a specific question', async () => {
      const res = await chai
        .request(app)
        .get(`/api/v1/questions/${questionId}`);
      expect(res).to.have.status(200);
      expect(res.body.data.question.title).to.equal('title 1');
    });
    it('Throw error id is in invalid', async () => {
        const res = await chai
          .request(app)
          .get('/api/v1/questions/ijkk');
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Invalid Id provided');
    });
    it('Throw error question is not found', async () => {
        const res = await chai
          .request(app)
          .get('/api/v1/questions/5d9c6d3e771aa30228f04884');
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Question not found');
    });
    it('Sort questions', async () => {
      const res = await chai.request(app).get('/api/v1/questions?sort=title');
      expect(res).to.have.status(200);
      expect(res.body.results).to.equal(2);
      expect(res.body.data.questions[0].title).to.equal('a');
    });
    it('Filters questions', async () => {
      const res = await chai.request(app).get('/api/v1/questions?title=a');
      expect(res).to.have.status(200);
      expect(res.body.results).to.equal(1);
      expect(res.body.data.questions[0].title).to.equal('a');
    });
    it('Select fields', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/questions?fields=-title');
      expect(res).to.have.status(200);
      expect(res.body.results).to.equal(2);
      expect(res.body.data.questions[0].title).to.equal(undefined);
    });
    it('Should Paginate', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/questions?page=1&limit=1');
      expect(res).to.have.status(200);
      expect(res.body.results).to.equal(1);
    });
  });
});

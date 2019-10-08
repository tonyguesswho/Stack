import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../api/models/userModels';
import app from '../../server';

chai.should();
chai.use(chaiHttp);

const signupData = {
  name: 'madiba',
  password: 'Password',
  confirmPassword: 'Password',
  email: 'samplel@gmail.com'
};

describe('Authentication and Authorization', () => {
  before(async () => {
    await User.deleteMany({});
  });
  describe('POST: /auth/signup', () => {
    it('should create a user successfully', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(signupData);
      expect(res).to.have.status(201);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data.user.email).to.equal('samplel@gmail.com');
    });
    it('Throw error on existing email', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send(signupData);
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('email already exists');
      expect(res.body.status).to.equal('fail');
    });
    it('Return an error for invalid email', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'madiba',
          password: 'Password',
          confirmPassword: 'Password',
          email: 'samplelgmail.com'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Invalid Email');
      expect(res.body.status).to.equal('fail');
    });
    it('Return an error for invalid password', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'madiba',
          password: 'Pass',
          confirmPassword: 'Pass',
          email: 'samplel@gmail.com'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Password less than 5 characters');
      expect(res.body.status).to.equal('fail');
    });
    it('Return an error for email not provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'madiba',
          password: 'Password',
          confirmPassword: 'Password'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Email is required');
      expect(res.body.status).to.equal('fail');
    });
    it('Return an error for name not provided', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          password: 'Password',
          confirmPassword: 'Password',
          email: 'samplel@gmail.com'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Name is required');
      expect(res.body.status).to.equal('fail');
    });
    it('Return an error for invalid confirmation password', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'madiba',
          password: 'Password',
          confirmPassword: 'wrongPassword',
          email: 'samplel@gmail.com'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal(
        'Confirm password and password field not identical'
      );
      expect(res.body.status).to.equal('fail');
    });
  });
});

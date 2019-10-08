import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import User from '../../api/models/userModels';
import app from '../../server';

chai.use(chaiHttp);

describe('User Login', () => {
  before(async () => {
    await User.deleteMany({});
    const user = new User({
      name: 'madiba',
      password: 'Password',
      confirmPassword: 'Password',
      email: 'sample1@gmail.com'
    });
    await user.save();
  });
  describe('POST: /users/login', () => {
    it('should generate login token', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'sample1@gmail.com',
          password: 'Password'
        });
      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.have.property('token');
    });
    it('Throw error on when fields are incomplete', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/users/login')
        .send({
          password: 'Password'
        });
      expect(res).to.have.status(400);
      expect(res.body.message).to.equal('Email or password not provided');
      expect(res.body.status).to.equal('fail');
    });
    it('Throw error on when credentials are invalid', async () => {
        const res = await chai
          .request(app)
          .post('/api/v1/users/login')
          .send({
            email: 'sample1@gmail.com',
            password: 'Passwordwrong'
          });
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Invalid email or password');
        expect(res.body.status).to.equal('fail');
      });
  });
});

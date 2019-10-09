import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

chai.use(chaiHttp);

describe('Default App tests', () => {
    it('return welcome message', async () => {
        const res = await chai.request(app).get('/');
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome');
      });
  it('return error on invalid route', async () => {
    const res = await chai.request(app).get('/wrong');
    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('/wrong does not exist on this server');
    expect(res.body.status).to.equal('fail');
  });
});

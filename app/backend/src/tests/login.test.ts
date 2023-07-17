import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/login.mock'
import { app } from '../app';
import UserModel from '../database/models/useModels/UserModel';
import jwt from '../utils/jwt';
import * as bc from 'bcryptjs';

chai.use(chaiHttp);

const { expect } = chai;

const sww = 'Something went wrong';

describe('Fluxo LOGIN ', () => {
  beforeEach(async () => { sinon.restore() } );

  describe('POST /', function () {
    it('00- SUCCESS => returns the token', async function() {
      sinon.stub(UserModel.prototype, 'queryEmail').resolves(mock.user);
      sinon.stub(bc, 'compareSync').returns(true);
      sinon.stub(jwt, 'sign').returns(mock.token);

      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.deep.eq({ token: mock.token })
    });

    it('01- FAILURE => missing email on req, returns status 400 and "all fields" message', async function () {
      const response = await chai.request(app).post('/login').send({ email: '', password: '123321' });

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('message', 'All fields must be filled')
    })

    it('02- FAILURE => missing password on req, returns status 400 and "all fields" message', async function () {
      const response = await chai.request(app).post('/login').send({ email: 'yil@liy.com', password: '' });

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.property('message', 'All fields must be filled')
    })

    it('03- FAILURE => if the password doesn"t match the unhashed password on DB', async function() {
      sinon.stub(UserModel.prototype, 'queryEmail').resolves(mock.user);
      sinon.stub(bc, 'compareSync').returns(false);
      
      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Invalid email or password');
    });

    it('04- FAILURE => if the emailQuery doesn"t found a user', async function () {
      sinon.stub(UserModel.prototype, 'queryEmail').resolves(null);

      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Invalid email or password');
    })

    it('05- FAILURE => if the email is not valid', async function () {
      const response = await chai.request(app).post('/login').send(mock.invEmail);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Invalid email or password');
    })

    it('06- FAILURE => if the password is not valid', async function () {
      const response = await chai.request(app).post('/login').send(mock.invPassword);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Invalid email or password');
    })

    it('07- THROWS => on db error returns status 500 and sww message', async function () {
      sinon.stub(UserModel.prototype, 'queryEmail').throws();

      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(500);
      expect(response.body).to.have.property('message', 'Something went wrong');
    })
  })

  describe('GET /roles', function () {
    it('00- On SUCCESS => returns the role of the user', async function() {
      sinon.stub(UserModel.prototype, 'userByPk').resolves(mock.user);
      sinon.stub(jwt, 'verify').returns(mock.user);

      const response = await chai.request(app)
        .get('/login/role')
        .set('authorization', mock.authHeader);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.deep.eq({ role: mock.user.role });
    })

    it('01- On FAILURE => if the token isn"t sent on the header', async function() {
      const response = await chai.request(app)
        .get('/login/role')

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Token not found');
    })

    it('02- FAILURE => if the token doesn"t abide to the Bearer format', async function() {
      const response = await chai.request(app)
        .get('/login/role')
        .set('authorization', mock.token);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    })

    it('03- FAILURE => if the token fails to be valid', async function() {
      const response = await chai.request(app)
        .get('/login/role')
        .set('authorization','Bearer '+ mock.user.email);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    })

    it('04- FAILURE => if the token fails to be valid', async function() {
      const response = await chai.request(app)
        .get('/login/role')
        .set('authorization','Bearer '+ mock.user.email);

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    })

    it('05- FAILURE => if the userId is not found on the db (NEVER case)', async function() {
      sinon.stub(UserModel.prototype, 'userByPk').resolves(null);

      const response = await chai.request(app)
        .get('/login/role')
        .set('authorization', mock.authHeader);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('role', 'not found');
    })

    it('06- THROWS => if the db throws, controller should set status 500, and message', async function () {
      sinon.stub(UserModel.prototype, 'userByPk').throws();

      const response = await chai.request(app)
      .get('/login/role')
      .set('authorization', mock.authHeader);

      expect(response.status).to.be.eq(500);
      expect(response.body).to.have.property('message', sww);
    })
  })
})
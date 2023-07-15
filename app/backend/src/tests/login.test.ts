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
      
      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('token', 'token')
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
      expect(response.body).to.have.property('message', 'Email or Password incorrect');
    });

    it('04- FAILURE => if the emailQuery doesn"t found a user', async function () {
      sinon.stub(UserModel.prototype, 'queryEmail').resolves(null);

      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(404);
      expect(response.body).to.have.property('message', 'User not found');
    })

    it('05- THROWS => on db error returns status 500 and sww message', async function () {
      sinon.stub(UserModel.prototype, 'queryEmail').throws();

      const response = await chai.request(app).post('/login').send(mock.payload);

      expect(response.status).to.be.eq(500);
      expect(response.body).to.have.property('message', 'Something went wrong');
    })
  })
})
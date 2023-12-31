import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/matches.mock';
import * as authMock from './mocks/login.mock';
import jwt from '../utils/jwt';
import { app } from '../app';
import MatchesModel from '../database/models/useModels/MatchesModel';
import TeamModel from '../database/models/useModels/teamsModel';

chai.use(chaiHttp);

const { expect } = chai;

const sww = 'Something went wrong';

describe('Fluxo MATCHES ', () => {
  beforeEach(async () => { sinon.restore() } );

  describe('GET /', function () {
    it('00- SUCCESS => returns the matches list', async function() {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.teams);

      const response = await chai.request(app).get('/matches');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.teams);
    });

    it('01- SUCCESS => returns the in progress matches when query term "inProgress" is "true"', async function () {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.InProgress);

      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.InProgress);
    })

    it('02- SUCCESS => returns the finished matches when query term "inProgress" is "false"', async function () {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.InProgress);

      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.InProgress);
    })

    it('03- SUCCESS => returns all matches when query term "inProgress" is any other thing', async function () {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.teams);

      const response = await chai.request(app).get('/matches?inProgress=green');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.teams);
    })

    it('04- THROWS => on db error returns status 500 and sww message', async function () {
      sinon.stub(MatchesModel.prototype, 'getAll').throws();

      const response = await chai.request(app).get('/matches')

      expect(response.status).to.eq(500);
      expect(response.body).to.be.deep.equal({ message: sww });
    })
  })

  describe('PATCH /:id/finish', function() {
    it('00- SUCCESS => returns message with 1 on data field', async function () {
      sinon.stub(MatchesModel.prototype, 'finishMatch').resolves(1);
      sinon.stub(jwt, 'verify').returns(authMock.user);

      const response = await chai.request(app)
        .patch('/matches/1/finish')
        .set('authorization', authMock.authHeader);

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.eq(1);
    })

    it('01- THROWS => returns the status 500 if db fails', async function () {
      sinon.stub(MatchesModel.prototype, 'finishMatch').throws();

      const response = await chai.request(app)
      .patch('/matches/1/finish')
      .set('authorization', authMock.authHeader);

      expect(response.status).to.be.eq(500);
      expect(response.body).to.deep.equal({ message: sww });
    })
  })

  describe('PATCH /:id', function() {
    it('00- SUCCESS => returns 1 indicating the number of affected rows', async function () {
      sinon.stub(MatchesModel.prototype, 'patchMatch').resolves(1);
      sinon.stub(jwt, 'verify').returns(authMock.user);

      const response = await chai.request(app)
        .patch('/matches/1')
        .set('authorization', authMock.authHeader)
        .send({
          homeTeamGoals: 1,
          awayTeamGoals: 2,
        });
      
      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.property('message', 'OK');
    })

    it('01- THROWS => returns the status 500 if db fails', async function () {
      sinon.stub(MatchesModel.prototype, 'patchMatch').throws();

      const response = await chai.request(app)
      .patch('/matches/1')
      .set('authorization', authMock.authHeader)
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 2,
      });;

      expect(response.status).to.be.eq(500);
      expect(response.body).to.deep.equal({ message: sww });
      })
    })

    describe('POST /', function() {
      it('00- SUCCESS => returns the created match', async function () {
        sinon.stub(MatchesModel.prototype, 'createMatch').resolves(mock.createMatch);
        sinon.stub(jwt, 'verify').returns(authMock.user);
  
        const response = await chai.request(app)
          .post('/matches')
          .set('authorization', authMock.authHeader)
          .send({
            homeTeamId: 2,
            homeTeamGoals: 1,
            awayTeamId: 1,
            awayTeamGoals: 2,
          });
        
        expect(response.status).to.be.eq(201);
        expect(response.body).to.be.deep.eq(mock.createMatch);
      })

      it('01- FAILURE => should return 422 if homeTeamId is the same as awayTeamId', async function () {
        sinon.stub(MatchesModel.prototype, 'createMatch').throws();
  
        const response = await chai.request(app)
        .post('/matches')
        .set('authorization', authMock.authHeader)
        .send({
          homeTeamId: 1,
          homeTeamGoals: 1,
          awayTeamId: 1,
          awayTeamGoals: 2,
        });;
  
        expect(response.status).to.be.eq(422);
        expect(response.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
      })

      it('02- FAILURE => should return 404 if any teamId returns null from db', async function () {
        sinon.stub(MatchesModel.prototype, 'createMatch').throws();
        sinon.stub(TeamModel.prototype, 'findById').resolves(null);
  
        const response = await chai.request(app)
        .post('/matches')
        .set('authorization', authMock.authHeader)
        .send({
          homeTeamId: 1,
          homeTeamGoals: 1,
          awayTeamId: 3,
          awayTeamGoals: 2,
        });;
  
        expect(response.status).to.be.eq(404);
        expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
      })
  
      it('03- THROWS => returns the status 500 if db fails', async function () {
        sinon.stub(MatchesModel.prototype, 'createMatch').throws();
  
        const response = await chai.request(app)
        .post('/matches')
        .set('authorization', authMock.authHeader)
        .send({
          homeTeamId: 2,
          homeTeamGoals: 1,
          awayTeamId: 1,
          awayTeamGoals: 2,
        });;
  
        expect(response.status).to.be.eq(500);
        expect(response.body).to.deep.equal({ message: sww });
      })
    });
});

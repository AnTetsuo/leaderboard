import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/leaderboard.mock'
import { app } from '../app';
import MatchesModel from '../database/models/useModels/MatchesModel';

chai.use(chaiHttp);

const { expect } = chai;

const sww = 'Something went wrong';

describe('Fluxo LEADERBOARD ', () => {
  beforeEach(async () => { sinon.restore() } );

  describe('GET /leaderboard/home || /leaderboard/away', function () {
    it('00- SUCCESS => returns the leaderboard ranking on Home Games', async function() {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.matches);

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.boardHome);
    });

    it('01- SUCCESS => returns the leaderboard ranking on Away Games', async function() {
      sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.matches);

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.boardAway);
    });

    it('02- THROWS => on db error returns status 500 and sww message', async function () {
      sinon.stub(MatchesModel.prototype, 'getAll').throws();

      const response = await chai.request(app).get('/leaderboard/home')

      expect(response.status).to.eq(500);
      expect(response.body).to.be.deep.equal({ message: sww });
    })
  })
    describe('GET /leaderboard', function () {
      it('00- SUCCESS => returns the leaderboard ranking on Home Games', async function() {
        sinon.stub(MatchesModel.prototype, 'getAll').resolves(mock.matches);
  
        const response = await chai.request(app).get('/leaderboard');
  
        expect(response.status).to.eq(200);
        expect(response.body).to.be.deep.equal(mock.leaderboard);
      });

      it('02- THROWS => on db error returns status 500 and sww message', async function () {
        sinon.stub(MatchesModel.prototype, 'getAll').throws();
  
        const response = await chai.request(app).get('/leaderboard')
  
        expect(response.status).to.eq(500);
        expect(response.body).to.be.deep.equal({ message: sww });
      })
  })
});

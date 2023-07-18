import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/matches.mock'
import { app } from '../app';
import MatchesModel from '../database/models/useModels/MatchesModel';

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
});

import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/teams.mock'
import { app } from '../app';
import TeamModel from '../database/models/useModels/teamsModel';

chai.use(chaiHttp);

const { expect } = chai;

const sww = 'Something went wrong';

describe('Fluxo TEAMS ', () => {
  beforeEach(async () => { sinon.restore() } );

  describe('GET /', function () {
    it('00- SUCCESS => returns the team list', async function() {
      sinon.stub(TeamModel.prototype, 'listAll').resolves(mock.list);

      const response = await chai.request(app).get('/teams');

      expect(response.status).to.eq(200);
      expect(response.body).to.be.deep.equal(mock.list);
    });

    it('01- THROWS => on db error returns status 500 and sww message', async function () {
      sinon.stub(TeamModel.prototype, 'listAll').throws();

      const response = await chai.request(app).get('/teams')

      expect(response.status).to.eq(500);
      expect(response.body).to.be.deep.equal({ message: sww });
    })
  })

  describe('GET "/:id"', function () {
    it('00- SUCCESS', async function () {
      sinon.stub(TeamModel.prototype, 'findById').resolves(mock.list[0]);

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.eq(200);
      expect(response.body).to.deep.equal(mock.list[0]);
    });
    it('01- FAILURE - NOT FOUND', async function() {
      sinon.stub(TeamModel.prototype, 'findById').resolves(null);

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.eq(404);
      expect(response.body).to.deep.equal({ message: 'Team not found' });
    });
    it('02- THROWS', async function() {
      sinon.stub(TeamModel.prototype, 'findById').throws();

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.eq(500);
      expect(response.body).to.be.deep.equal({ message: sww });
    });
  })

});

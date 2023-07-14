import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as mock from './mocks/teams.mock'
import { app } from '../app';
import TeamModel from '../database/models/useModels/teamsModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('Fluxo TEAMS ', () => {
  beforeEach(async () => { sinon.restore() } );

  it('00- GET @ "/" => returns the team list', async () => {
    //ARRANGE
    sinon.stub(TeamModel.prototype, 'listAll').resolves(mock.list);
    //ACT
    const response = await chai.request(app).get('/teams')
    //ASSERT
    expect(response.status).to.eq(200);
    expect(response.body).to.be.deep.equal(mock.list);
  });
});

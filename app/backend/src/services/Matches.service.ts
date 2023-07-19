import { postMatch } from '../types/bodyTypes';
import { ServRes } from '../Interfaces/services/IResponse';
import IMatch from '../Interfaces/IMatch';
import MatchesModel from '../database/models/useModels/MatchesModel';
import TeamsModel from '../database/models/useModels/teamsModel';
import { noMirrorMatches } from './validations/validate';

export default class TeamService {
  constructor(
    private db = new MatchesModel(),
    private teams = new TeamsModel(),
    private validate = { noMirrorMatches },
  ) { }

  public async listAll(progress?: number | undefined): Promise<ServRes<IMatch[]>> {
    const inProgress = progress === undefined ? undefined : Boolean(progress);
    const dbData = await this.db.getAll(inProgress);
    return { status: 'OK', data: dbData };
  }

  public async finishMatch(id: number):Promise<ServRes<number>> {
    const finished = await this.db.finishMatch(id);
    return { status: 'OK', data: finished };
  }

  public async updateScore(
    id: number,
    newScore: {
      homeTeamGoals: number,
      awayTeamGoals: number,
    },
  ): Promise<ServRes<number>> {
    const result = await this.db.patchMatch(id, newScore);
    return { status: 'OK', data: result };
  }

  public async startMatch(payload: postMatch): Promise<ServRes<IMatch>> {
    if (this.validate.noMirrorMatches(payload)) {
      return {
        status: 'UNPROCESSABLE_ENTITY',
        data: {
          message: 'It is not possible to create a match with two equal teams',
        },
      };
    }
    const { homeTeamId, awayTeamId } = payload;

    if (await this.getTeams(homeTeamId, awayTeamId)) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }

    const newMatch = await this.db.createMatch(payload);
    return { status: 'OK', data: newMatch };
  }

  private async getTeams(awayTeamId:number, homeTeamId: number): Promise<boolean> {
    const homeTeam = await this.teams.findById(homeTeamId);
    const awayTeam = await this.teams.findById(awayTeamId);

    return homeTeam === null || awayTeam === null;
  }
}

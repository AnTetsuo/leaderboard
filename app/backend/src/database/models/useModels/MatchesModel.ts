import { postMatch } from '../../../types/bodyTypes';
import IMatch from '../../../Interfaces/IMatch';
import Match from '../Match.model';
import Team from '../Team.model';

export default class MatchesModel {
  private db = Match;

  public async getAll(progress?: boolean): Promise<IMatch[]> {
    const filterOp = typeof progress === 'boolean' ? { where: { inProgress: progress } } : null;
    const matches = await this.db.findAll(

      { ...filterOp,
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ],
      },
    );

    return matches;
  }

  public async finishMatch(id: number) {
    const [result] = await this.db.update({ inProgress: false }, { where: { id } });
    return result;
  }

  public async patchMatch(
    id: number,
    newScore: {
      homeTeamGoals: number,
      awayTeamGoals: number,
    },
  ): Promise<number> {
    const [affectedCount] = await this.db.update({ ...newScore }, { where: { id } });
    return affectedCount;
  }

  public async createMatch(payload: postMatch): Promise<IMatch> {
    const newMatch = await this.db.create({ ...payload, inProgress: true });

    return newMatch;
  }
}

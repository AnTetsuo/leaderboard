import IMatch from '../../../Interfaces/IMatch';
import Match from '../Match.model';
import Team from '../Team.model';

export default class MatchesModel {
  private db = Match;

  public async getAll(progress?: boolean): Promise<IMatch[]> {
    console.log(typeof progress);
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
}

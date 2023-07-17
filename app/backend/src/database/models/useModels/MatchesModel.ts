import IMatch from '../../../Interfaces/IMatch';
import Match from '../Match.model';
import Team from '../Team.model';

export default class MatchesModel {
  private db = Match;

  public async getAll(): Promise<IMatch[]> {
    const matches = await this.db.findAll(
      { include: [
        { model: Team, as: 'homeTeam', attributes: ['teamName'] },
        { model: Team, as: 'awayTeam', attributes: ['teamName'] },
      ] },
    );

    return matches;
  }
}

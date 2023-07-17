import { ServRes } from '../Interfaces/services/IResponse';
import IMatch from '../Interfaces/IMatch';
import MatchesModel from '../database/models/useModels/MatchesModel';

export default class TeamService {
  constructor(
    private db = new MatchesModel(),
  ) { }

  public async listAll(): Promise<ServRes<IMatch[]>> {
    const dbData = await this.db.getAll();
    return { status: 'OK', data: dbData };
  }
}

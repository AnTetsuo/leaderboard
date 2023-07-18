import { ServRes } from '../Interfaces/services/IResponse';
import IMatch from '../Interfaces/IMatch';
import MatchesModel from '../database/models/useModels/MatchesModel';

export default class TeamService {
  constructor(
    private db = new MatchesModel(),
  ) { }

  public async listAll(progress?: number | undefined): Promise<ServRes<IMatch[]>> {
    const inProgress = progress === undefined ? undefined : Boolean(progress);
    const dbData = await this.db.getAll(inProgress);
    return { status: 'OK', data: dbData };
  }
}

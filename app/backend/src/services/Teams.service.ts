import { ServRes } from '../Interfaces/services/IResponse';
import ITeam from '../Interfaces/ITeam';
import IService from '../Interfaces/services/IService';
import TeamModel from '../database/models/useModels/teamsModel';

export default class TeamService implements IService<ITeam> {
  constructor(
    private dbTeams = new TeamModel(),
  ) { }

  public async listAll(): Promise<ServRes<ITeam[]>> {
    const dbData = await this.dbTeams.listAll();
    return { status: 'OK', data: dbData };
  }

  public async findById(id: number): Promise<ServRes<ITeam>> {
    const dbData = await this.dbTeams.findById(id);
    if (!dbData) return { status: 'NOT_FOUND', data: { message: 'Team not found' } };

    return { status: 'OK', data: dbData };
  }
}

import ITeam from '../../../Interfaces/ITeam';
import IModel from '../../../Interfaces/models/IModel';
import Team from '../Team.model';

export default class TeamModel implements IModel<Omit<ITeam, 'id'>> {
  private db = Team;

  public async listAll(): Promise<ITeam[]> {
    const teamList = await this.db.findAll();
    return teamList;
  }

  public async findById(id: number): Promise<ITeam | null> {
    const team = await this.db.findByPk(id);
    return team;
  }
}

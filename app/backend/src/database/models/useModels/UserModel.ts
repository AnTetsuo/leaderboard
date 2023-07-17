import { login } from '../../../types/bodyTypes';
import IUser from '../../../Interfaces/IUser';
import User from '../User.model';

export default class UserModel {
  private db = User;

  public async queryEmail(payload: login): Promise<IUser | null> {
    const { email } = payload;
    const user = await this.db.findOne({ where: { email } });
    return user;
  }

  public async userByPk(id: number): Promise<IUser | null> {
    const user = await this.db.findByPk(id);

    return user;
  }
}

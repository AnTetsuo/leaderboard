import * as bcrypt from 'bcryptjs';
import jwt from '../utils/jwt';
import { ServRes } from '../Interfaces/services/IResponse';
import { login } from '../types/bodyTypes';
import UserModel from '../database/models/useModels/UserModel';

export default class LoginService {
  constructor(
    private db = new UserModel(),
    private bc = bcrypt,
    private webToken = jwt,
  ) { }

  public async login(payload: login): Promise<ServRes<{ token: string }>> {
    const user = await this.db.queryEmail(payload);

    if (!user) return { status: 'NOT_FOUND', data: { message: 'User not found' } };

    if (!this.bc.compareSync(payload.password, user.password)) {
      return { status: 'INVALID_DATA', data: { message: 'Email or Password incorrect' } };
    }
    const token = this.webToken.sign({ id: user.id, email: user.email });
    return { status: 'OK', data: { token } };
  }
}

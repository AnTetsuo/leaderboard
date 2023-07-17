import * as bcrypt from 'bcryptjs';
import jwt from '../utils/jwt';
import { ServRes } from '../Interfaces/services/IResponse';
import { login } from '../types/bodyTypes';
import UserModel from '../database/models/useModels/UserModel';
import { emailTest, passwordTest } from './validations/validate';

export default class LoginService {
  constructor(
    private db = new UserModel(),
    private bc = bcrypt,
    private webToken = jwt,
    private validations = { emailTest, passwordTest },
  ) { }

  public async login(payload: login): Promise<ServRes<{ token: string }>> {
    console.log(payload.email);
    console.log(payload.password);
    const errMessage = 'Invalid email or password';

    if (!this.validations.emailTest(payload.email)
      || this.validations.passwordTest(payload.password)) {
      return { status: 'INVALID_DATA', data: { message: errMessage } };
    }

    const user = await this.db.queryEmail(payload);

    if (!user || !this.bc.compareSync(payload.password, user.password)) {
      return { status: 'INVALID_DATA', data: { message: errMessage } };
    }

    const token = this.webToken.sign({ id: user.id, email: user.email });
    return { status: 'OK', data: { token } };
  }
}

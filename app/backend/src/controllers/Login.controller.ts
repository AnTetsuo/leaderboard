import { Response, Request } from 'express';
import getErr from '../utils/mapErrStatus';
import { login } from '../types/bodyTypes';
import LoginService from '../services/Login.service';

export default class LoginController {
  constructor(
    private service = new LoginService(),
    private sww = 'Something went wrong',
  ) {
  }

  public async post(req: Request, res: Response) {
    try {
      const payload: login = {
        email: req.body.email, password: req.body.password,
      };
      const { status, data } = await this.service.login(payload);
      if (status !== 'OK') return res.status(getErr(status)).json(data);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(getErr('500')).json({ message: this.sww });
    }
  }

  public async getRole(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const { data } = await this.service.getRole(userId);

      res.status(200).json(data);
    } catch (error) {
      return res.status(getErr('500')).json({ message: this.sww });
    }
  }
}

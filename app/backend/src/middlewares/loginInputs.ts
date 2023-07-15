import { Request, Response, NextFunction } from 'express';

export default class validateLogin {
  public static checkPassword(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'All fields must be filled' });
    next();
  }

  public static checkEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'All fields must be filled' });
    next();
  }
}

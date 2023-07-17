import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

export default class MatchesController {
  constructor(
    private errMessage: string = 'Something went wrong',
    private service = new MatchesService(),
  ) { }

  public async listAll(_req: Request, res: Response) {
    try {
      const response = await this.service.listAll();
      res.status(200).json(response.data);
    } catch (e) {
      res.status(500).json({ message: this.errMessage });
    }
  }
}

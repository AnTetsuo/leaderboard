import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

export default class MatchesController {
  constructor(
    private errMessage: string = 'Something went wrong',
    private service = new MatchesService(),
  ) { }

  public async listAll(
    req: Request,
    res: Response,
  ) {
    const { inProgress } = req.query;
    const query = typeof inProgress !== 'string' ? undefined : this.toBool(inProgress);
    try {
      const response = await this.service.listAll(query);
      res.status(200).json(response.data);
    } catch (e) {
      res.status(500).json({ message: this.errMessage });
    }
  }

  private toBool = (boolString: string | undefined) => (boolString === 'true' ? 1 : 0);
}

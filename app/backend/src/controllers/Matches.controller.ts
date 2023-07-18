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

  public async finishMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data } = await this.service.finishMatch(Number(id));
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ message: this.errMessage });
    }
  }

  public async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const { status } = await this.service.updateScore(Number(id), req.body);
      res.status(200).json({ message: status });
    } catch (e) {
      res.status(500).json({ message: this.errMessage });
    }
  }

  private toBool = (boolString: string) => (boolString === 'true' ? 1 : 0);
}

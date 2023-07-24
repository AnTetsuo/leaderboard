import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

export default class LeaderboardController {
  constructor(
    private service = new LeaderboardService(),
  ) { }

  public async getHomeLeaderboard(req: Request, res: Response) {
    const config = req.path.includes('home');
    try {
      const { data } = await this.service.leaderboard(config);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  public async getLeaderboard(req: Request, res: Response) {
    try {
      const { data } = await this.service.leaderboard();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

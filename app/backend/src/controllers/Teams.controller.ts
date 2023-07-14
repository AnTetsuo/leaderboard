import { Request, Response } from 'express';
import TeamService from '../services/Teams.service';

export default class TeamController {
  private service;
  constructor() {
    this.service = new TeamService();
  }

  public async listAll(_req: Request, res: Response) {
    try {
      const response = await this.service.listAll();
      res.status(200).json(response.data);
    } catch (e) {
      res.status(500).json('AAA');
    }
  }
}

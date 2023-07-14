import { Request, Response } from 'express';
import TeamService from '../services/Teams.service';

export default class TeamController {
  private service;
  constructor(
    private errMessage: string = 'Something went wrong',
  ) {
    this.service = new TeamService();
  }

  public async listAll(_req: Request, res: Response) {
    try {
      const response = await this.service.listAll();
      res.status(200).json(response.data);
    } catch (e) {
      res.status(500).json({ message: this.errMessage });
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, data } = await this.service.findById(Number(id));
      if (status !== 'OK') return res.status(404).json(data);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: this.errMessage });
    }
  }
}

import { Router } from 'express';
import TeamController from '../controllers/Teams.controller';

const tc = new TeamController();
const teamRoute = Router();

teamRoute.get('/', (req, res) => tc.listAll(req, res));

export default teamRoute;

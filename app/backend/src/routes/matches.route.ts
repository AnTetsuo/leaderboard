import { Router } from 'express';
import MatchesController from '../controllers/Matches.controller';

const mc = new MatchesController();
const matchesRoute = Router();

matchesRoute.get('/', (req, res) => mc.listAll(req, res));

export default matchesRoute;

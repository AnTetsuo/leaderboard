import { Router } from 'express';
import validateToken from '../middlewares/OpToken';
import MatchesController from '../controllers/Matches.controller';

const mc = new MatchesController();
const matchesRoute = Router();

matchesRoute.get('/', (req, res) => mc.listAll(req, res));

matchesRoute.patch(
  '/:id/finish',
  validateToken,
  (req, res) => mc.finishMatch(req, res),
);

matchesRoute.patch(
  '/:id',
  validateToken,
  (req, res) => mc.updateMatch(req, res),
);

matchesRoute.post(
  '/',
  validateToken,
  (req, res) => mc.postMatch(req, res),
);

export default matchesRoute;

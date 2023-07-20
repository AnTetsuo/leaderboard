import { Router } from 'express';
import LeaderboardController from '../controllers/Leaderboard.controller';

const lbc = new LeaderboardController();
const leaderboardRoute = Router();

leaderboardRoute.get('/home', (req, res) => lbc.getHomeLeaderboard(req, res));

leaderboardRoute.get('/away', (req, res) => lbc.getHomeLeaderboard(req, res));

export default leaderboardRoute;

import { Router } from 'express';
import validateToken from '../middlewares/OpToken';
import Validate from '../middlewares/loginInputs';
import LoginController from '../controllers/Login.controller';

const login = new LoginController();
const loginRoute = Router();

loginRoute.post(
  '/',
  Validate.checkEmail,
  Validate.checkPassword,
  (req, res) => login.post(req, res),
);

loginRoute.get(
  '/role',
  validateToken,
  (req, res) => login.getRole(req, res),
);

export default loginRoute;

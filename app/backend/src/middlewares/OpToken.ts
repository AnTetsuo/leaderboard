import { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';

function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('authorization');
  if (!token) return res.status(401).json({ message: 'Token not found' });
  if (token.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  try {
    req.body.userId = jwt.verify(token.split(' ')[1]).id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token must be a valid token' });
  }
}

export default validateToken;

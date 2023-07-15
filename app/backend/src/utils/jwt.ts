import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

type TokenPayload = {
  id: number,
  email: string,
};

function sign(payload: TokenPayload): string {
  return jwt.sign(payload, secret);
}

function verify(token: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

export default {
  sign,
  verify,
};

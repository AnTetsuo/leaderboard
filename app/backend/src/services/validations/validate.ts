import { postMatch } from '../../types/bodyTypes';

export function emailTest(email: string): boolean {
  const emailExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailExp.test(email);
}

export function passwordTest(password: string): boolean {
  return password.length <= 5;
}

export function noMirrorMatches(payload: postMatch): boolean {
  const { homeTeamId, awayTeamId } = payload;
  return Number(homeTeamId) === Number(awayTeamId);
}

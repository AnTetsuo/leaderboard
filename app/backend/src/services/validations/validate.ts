export function emailTest(email: string): boolean {
  const emailExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailExp.test(email);
}

export function passwordTest(password: string): boolean {
  return password.length <= 5;
}

const errMap = new Map <string, number>([
  ['NOT_FOUND', 404],
  ['INVALID_DATA', 401],
]);

export default function getErr(desc: string) {
  return errMap.get(desc) || 500;
}

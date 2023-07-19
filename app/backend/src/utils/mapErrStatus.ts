const errMap = new Map <string, number>([
  ['NOT_FOUND', 404],
  ['INVALID_DATA', 401],
  ['UNPROCESSABLE_ENTITY', 422],
]);

export default function getErr(desc: string) {
  return errMap.get(desc) || 500;
}

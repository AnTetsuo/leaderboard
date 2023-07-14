import { ServRes } from './IResponse';

export default interface IService<T> {
  listAll(): Promise<ServRes<T[]>>;
}

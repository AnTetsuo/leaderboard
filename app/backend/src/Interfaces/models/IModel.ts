export default interface IModel<T> {
  listAll(): Promise<T[]>,
  findById(id: number): Promise<T | null>,
}

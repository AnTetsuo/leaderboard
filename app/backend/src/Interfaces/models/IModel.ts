export default interface IModel<T> {
  listAll(): Promise<T[]>
}

export interface IObjectParser<T extends Record<any, any>, U> {
  parseKey(key: keyof T): void;
  get(): U;
}

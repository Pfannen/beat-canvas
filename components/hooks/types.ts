export type DelegateGetter = <T extends {}, U extends {}>(
  extraDelegates: T
) => U & T;

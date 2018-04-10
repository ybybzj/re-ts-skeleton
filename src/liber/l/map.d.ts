import { Indexable } from './../pervasive'
export = Map

declare function Map<T>(
  fn: (v: any, index: number, o: Indexable) => T,
  o: Indexable
): T[]

declare function Map<T>(
  fn: (v: any, index: number, o: Indexable) => T
): (o: Indexable) => T[]

export = CreateStream

declare function CreateStream<T>(value?: T): CreateStream.Stream<T>
declare function CreateStream(): CreateStream.Stream<void>

declare namespace CreateStream {
  export interface Stream<T> {
    (): T
    (v: T): Stream<T>
    on<T>(handler: (v: T) => void): Stream<T>
  }

  export interface Combine {
    <T, R>(
      fn: (value: Stream<T>, self: Stream<R>) => R | void,
      streams: [Stream<T>]
    ): Stream<R>
    <T, T1, R>(
      fn: (value: Stream<T>, t1: Stream<T1>, self: Stream<R>) => R | void,
      streams: [Stream<T>, Stream<T1>]
    ): Stream<R>
    <T, T1, T2, R>(
      fn: (
        value: Stream<T>,
        t1: Stream<T1>,
        t2: Stream<T2>,
        self: Stream<R>
      ) => R | void,
      streams: [Stream<T>, Stream<T1>, Stream<T2>]
    ): Stream<R>

    <T, T1, T2, T3, R>(
      fn: (
        value: Stream<T>,
        t1: Stream<T1>,
        t2: Stream<T2>,
        t3: Stream<T3>,
        self: Stream<R>
      ) => R | void,
      streams: [Stream<T>, Stream<T1>, Stream<T2>, Stream<T3>]
    ): Stream<R>
  }

  export function isStream<T>(v: any): boolean
}

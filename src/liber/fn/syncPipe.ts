type SyncPipeMapper<T, U> = (data: T | U) => U

function syncPipeReducer<T, U>(
  f: SyncPipeMapper<T, U>,
  g: SyncPipeMapper<T, U>
): SyncPipeMapper<T, U> {
  return (data: T) => g(f(data))
}
export default function syncPipe<T, U>(
  ...fns: SyncPipeMapper<T, U>[]
): SyncPipeMapper<T, U> {
  return fns.reduce(syncPipeReducer)
}

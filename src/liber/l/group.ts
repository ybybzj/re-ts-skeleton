function group<T, K extends keyof T>(
  keys: K[],
  os: T[]
): { [k: string]: T[K][] }
function group<T, K extends keyof T>(
  keys: K[]
): (os: T[]) => { [k: string]: T[K][] }
function group<T, K extends keyof T>(keys: K[], os?: T[]): any {
  if (os == null) {
    return (os: T[]) => group(keys, os)
  } else {
    const result: { [k: string]: T[K][] } = {}
    return keys.reduce((result, k) => {
      result[k as string] = os.map((o) => o[k])
      return result
    }, result)
  }
}
export default group

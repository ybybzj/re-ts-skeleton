import Type from '../liber/type'
import { Dict } from '../liber/pervasive'
export function fixNSForStr(ns: string, s: string): string {
  const prefixChar = s.charAt(0)
  s = prefixChar === '::' ? s.slice(1) : s
  if (s.trim().length <= 0) {
    throw new Error(`[_fixNSForStr]invalid identifier for namespace ${ns}`)
  }

  if (prefixChar === '::' || prefixChar === '@') {
    return s
  } else {
    return `${ns}.${s}`
  }
}

export function fixNSforObject<T>(
  ns: string,
  o: { [key: string]: T },
  fixValue?: (ns: string, v: T) => T
): { [key: string]: T } {
  return Object.keys(o).reduce((m: { [key: string]: T }, k: keyof typeof o) => {
    m[fixNSForStr(ns, k)] = fixValue ? fixValue(ns, o[k]) : o[k]
    return m
  }, {})
}

function hasOwn(o: any, k: string): boolean {
  return Object.prototype.hasOwnProperty.call(o, k)
}

function isObj(o: any): o is Dict {
  return Type(o) === 'object'
}

export function mergeObjsExn(os: Dict[]): Dict {
  return os.reduce((result, o: null | undefined | Dict) => {
    if (isObj(o)) {
      const keys = Object.keys(o)

      keys.forEach((k) => {
        if (hasOwn(result, k)) {
          throw new Error(`[mergeObjsExn]duplicate key "${k}" to merge into`)
        }
        result[k] = o[k]
      })
    }
    return result
  }, {})
}

import Type from '../type'
import { Indexable, ArrLike, Dict } from '../pervasive'
interface ErrCtor {
  new (string: string): Error
}

function error(msg: string = '', errCtor: ErrCtor = Error): void {
  throw new errCtor(msg)
}

function isObjLike(o: Indexable): o is Indexable {
  const t = Type(o)
  return t === 'array' || t === 'object'
}

type keyPath = string | number

function _valByKeypath(kpath: keyPath, o: Indexable): any {
  switch (true) {
    case Type.isNumber(kpath) && isObjLike(o):
      return (o as ArrLike)[kpath as number]
    case Type.isString(kpath) && isObjLike(o):
      kpath = (kpath as string).trim()
      if (kpath.length === 0) {
        return o
      }

      const paths = kpath.split('.')
      if (paths.length <= 1) {
        return (o as Dict)[kpath as string]
      }

      let i = 0
      while (i < paths.length) {
        o = (o as Dict)[paths[i]]
        if (!isObjLike(o)) {
          break
        }
        i += 1
      }

      if (i < paths.length - 1) {
        return undefined
      }
      return o
    default:
      return o
  }
}

function _updateKeyPath(
  kpath: keyPath,
  o: Indexable,
  data: any,
  fn?: (o: Indexable, v: any) => any
): Indexable {
  const inputObj = o

  switch (true) {
    case Type.isNumber(kpath) && isObjLike(o):
      ;(o as ArrLike)[kpath as number] = _val(
        (o as ArrLike)[kpath as number],
        data,
        fn
      )
      break
    case Type.isString(kpath) && isObjLike(o):
      kpath = (kpath as string).trim()
      if (kpath.length === 0) {
        break
      }

      const paths = kpath.split('.')
      let i = 0,
        p,
        _o

      while (i < paths.length - 1) {
        p = paths[i]
        _o = (o as Dict)[p]

        if (!isObjLike(_o)) {
          if (_o !== undefined) {
            error(
              '[updateKeyPath] invalid keypath! Value with path "' +
                paths.slice(0, i + 1).join('.') +
                '" should be an object, but given: ' +
                _o
            )
          } else {
            ;(o as Dict)[p] = {}
          }
        }

        o = (o as Dict)[p]
        i += 1
      }

      ;(o as Dict)[paths[i]] = _val((o as Dict)[paths[i]], data, fn)
  }

  return inputObj

  function _val(
    prevData: any,
    data: any,
    fn?: (o: Indexable, v: any) => any
  ): any {
    if (typeof fn === 'function') {
      return fn(prevData, data)
    } else {
      return data
    }
  }
}

function valByKeypath(kpath: keyPath, o: Indexable): any
function valByKeypath(
  kpath: keyPath,
  o: Indexable,
  data: any,
  fn?: (o: Indexable, v: any) => any
): Indexable
function valByKeypath(
  kpath: string,
  o: Indexable,
  data?: any,
  fn?: (o: Indexable, v: any) => any
): any {
  if (arguments.length < 3) {
    return _valByKeypath(kpath, o)
  } else {
    return _updateKeyPath(kpath, o, data, fn)
  }
}

export default valByKeypath

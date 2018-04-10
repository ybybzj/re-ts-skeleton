const typeReg = /^\[object (\w+)\]$/
type jsType =
  | 'null'
  | 'undefined'
  | 'NaN'
  | 'string'
  | 'number'
  | 'function'
  | 'array'
  | 'object'
  | 'regexp'
  | 'arguments'
  | 'boolean'
  | 'unknown'
type typeAssert = (o: any) => boolean
interface TypeTester {
  (o: any): jsType
  isString: typeAssert
  isFunction: typeAssert
  isArray: typeAssert
  isUndefined: typeAssert
  isNull: typeAssert
  isObject: typeAssert
  isRegExp: typeAssert
  isArguments: typeAssert
  isBoolean: typeAssert
  isNaN: typeAssert
  isNumber: typeAssert
  isAny: typeAssert
  [key: string]: typeAssert
}

const type = function type(o: any): jsType {
  if (o === null) {
    return 'null'
  }
  if (o === undefined) {
    return 'undefined'
  }
  if (o !== o) {
    return 'NaN'
  }
  /* jshint eqnull: true */
  const tm = Object.prototype.toString.call(o).match(typeReg)
  return tm == null ? 'unknown' : tm[1].toLowerCase()
} as TypeTester
;[
  'String',
  'Function',
  'Array',
  'Undefined',
  'Null',
  'Object',
  'RegExp',
  'Arguments',
  'Boolean',
].forEach((name: string) => {
  type['is' + name] = (o) => {
    return type(o) === name.toLowerCase()
  }
})

type.isNaN = (o) => {
  return type(o) === 'NaN'
}

type.isNumber = (o) => {
  return type(o) === 'number' && !isNaN(o)
}

type.isAny = () => {
  return true
}

export default type

import R from '../liber/frp/rstream'
import { Handler, Select, EventSchema, EventCtor, SchemaEntry } from './types'
import { fixNSforObject, fixNSForStr } from './helpers'

export interface EventStream {
  send<T>(name: string, payload: T): void
  on<T>(name: string, handler: Handler<T>): void
  has(name: string): boolean
  each(fn: (name: string) => void): void
}

const bags: { [name: string]: R.Stream<any> } = {}
function getStream<T>(name: string): R.Stream<T> {
  let es = bags[name]
  if (!R.isStream(es)) {
    es = bags[name] = R()
  }
  return es
}

function has(name: string): boolean {
  return R.isStream(bags[name])
}

function set<T>(name: string, s: R.Stream<T>): void {
  bags[name] = s
}

function send<T>(name: string, payload: T): void {
  const s = getStream(name)
  s(payload)
}

function on<T>(name: string, handler: Handler<T>): void {
  const es = getStream(name)
  es.on(handler)
}

function each(fn: (name: string) => void): void {
  Object.keys(bags).forEach(fn)
}

export function resolveSchema(get: Select, schema: EventSchema): EventStream {
  Object.keys(schema).forEach((name) => {
    _resolveEvent(name, get, schema)
  })

  return {
    has,
    each,
    on,
    send,
  }
}

function _resolveEvent(
  name: string,
  get: Select,
  schema: EventSchema
): R.Stream<any> {
  if (schema[name] == null || has(name)) {
    return getStream(name)
  } else {
    return _combineEvents(name, get, schema)
  }
}

function _combineEvents(
  name: string,
  get: Select,
  schema: EventSchema
): R.Stream<any> {
  const schemaEntry = schema[name]
  const depStreamNames = schemaEntry.slice(
    0,
    schemaEntry.length - 1
  ) as string[]
  const depStreams = depStreamNames.map((depName) => {
    return _resolveEvent(depName, get, schema)
  })
  const combineFn = schemaEntry[schemaEntry.length - 1] as EventCtor

  const resolvedStream = combineFn.apply(null, [get].concat(depStreams))

  set(name, resolvedStream)

  return resolvedStream
}

export function fixNSforEventSchema(
  ns: string,
  schema: EventSchema
): EventSchema {
  return fixNSforObject<SchemaEntry>(ns, schema, (ns, entry) => {
    return (entry as (string | EventCtor)[]).map((s: string | EventCtor) => {
      if (typeof s === 'string') {
        return fixNSForStr(ns, s)
      } else {
        return s
      }
    }) as SchemaEntry
  })
}

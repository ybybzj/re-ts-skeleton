import { StateReducerMap, StateEntry, Reducer, Action } from './types'
import { fixNSforObject, mergeObjsExn } from './helpers'
import { combineReducers, ReducersMapObject } from 'redux'
import mapObject from '../liber/l/mapObject'

export function fixNSforReducerMap(
  ns: string,
  map: StateReducerMap
): { [key: string]: StateReducerMap } {
  const result: { [key: string]: StateReducerMap } = {}
  result[ns] = Object.keys(map).reduce(
    (m: { [key: string]: StateEntry<any> }, k) => {
      const [defaultValue, reducers] = map[k]
      m[k] = [defaultValue, fixNSforObject<any>(ns, reducers)]
      return m
    },
    {}
  )
  return result
}

function makeReducerFromStateEntry<T>([defaultValue, reducers]: StateEntry<
  T
>): Reducer<T, any> {
  return (state: T | undefined | null, action: Action<any>) => {
    const type = action.type
    const reducer = reducers[type]
    if (state == null) {
      state = defaultValue
    }
    if (typeof reducer === 'function') {
      return reducer(state, action.payload)
    } else {
      return state
    }
  }
}

function makeReducerFromStateMap<T>(map: StateReducerMap): Reducer<T, any> {
  const reducerMap = mapObject(
    makeReducerFromStateEntry,
    map
  ) as ReducersMapObject
  return combineReducers<T>(reducerMap)
}

export function buildReducer(
  reducerMaps: {
    [key: string]: StateReducerMap
  },
  extReducers?: ReducersMapObject
): Reducer<any, any> {
  let maps = mapObject(
    makeReducerFromStateMap,
    reducerMaps
  ) as ReducersMapObject
  if (extReducers != null) {
    maps = mergeObjsExn([maps, extReducers])
  }
  return combineReducers<any>(maps)
}

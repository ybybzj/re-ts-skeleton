import R from '../liber/frp/rstream'
import { Unsubscribe } from 'redux'

export type ActionType = string
export interface Action<T> {
  type: ActionType
  payload: T
}

export type Command<T> = Action<T>

export type Update<T> = Action<T>

export type Reducer<S, T> = (
  state: S | null | undefined,
  action: Action<T>
) => S

export type Handler<T> = (payload: T) => void

export type Dispatch<T> = (action: Action<T>) => Action<T>

export type getState<T> = () => T
export type getStateAny = getState<any>

export interface Store<S> {
  dispatch: Dispatch<any>
  getState: getState<S>
  subscribe(listener: () => void): Unsubscribe
  replaceReducer(nextReducer: Reducer<S, any>): void
  select(selkey: string): any
}

export type StoreEnhancer = (createStore: StoreCreator) => StoreCreator

export interface StoreCreator {
  <S, Ext, P>(reducer: Reducer<S, P>, enhancer?: StoreEnhancer): Store<S> & Ext;
  <S, Ext, P>(reducer: Reducer<S, P>, preloadedState: S, enhancer?: StoreEnhancer): Store<S> & Ext
}

export type Select = (selkey: string) => any

// business module

export type EventCtor1 = <T, R>(
  get: getStateAny,
  value: R.Stream<T>
) => R.Stream<R>

export type EventCtor2 = <T, T1, R>(
  get: getStateAny,
  value: R.Stream<T>,
  t1: R.Stream<T1>
) => R.Stream<R>

export type EventCtor3 = <T, T1, T2, R>(
  get: getStateAny,
  value: R.Stream<T>,
  t1: R.Stream<T1>,
  t2: R.Stream<T2>
) => R.Stream<R>

export type EventCtor4 = <T, T1, T2, T3, R>(
  value: R.Stream<T>,
  get: getStateAny,
  t1: R.Stream<T1>,
  t2: R.Stream<T2>,
  t3: R.Stream<T3>
) => R.Stream<R>

export type EventCtor = EventCtor1 | EventCtor2 | EventCtor3 | EventCtor4

export type SchemaEntry =
  | [string, EventCtor1]
  | [string, string, EventCtor2]
  | [string, string, string, EventCtor3]
  | [string, string, string, string, EventCtor4]

export interface EventSchema {
  [name: string]: SchemaEntry
}
export interface EntryReducer<T> {
  [action: string]: <P>(state: T, payload: P) => T
}

export type StateEntry<T> = [T, EntryReducer<T>]

export interface StateReducerMap {
  [key: string]: StateEntry<any>
}

export type Selector1 = <T, R>(v: T) => R
export type Selector2 = <T, T1, R>(v: T, v1: T1) => R
export type Selector3 = <T, T1, T2, R>(v: T, v1: T1, v2: T2) => R
export type Selector4 = <T, T1, T2, T3, R>(v: T, v1: T1, v2: T2, v3: T3) => R
export type Selector5 = <T, T1, T2, T3, T4, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4
) => R
export type Selector6 = <T, T1, T2, T3, T4, T5, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5
) => R
export type Selector7 = <T, T1, T2, T3, T4, T5, T6, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6
) => R
export type Selector8 = <T, T1, T2, T3, T4, T5, T6, T7, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6,
  v7: T7
) => R
export type Selector9 = <T, T1, T2, T3, T4, T5, T6, T7, T8, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6,
  v7: T7,
  v8: T8
) => R
export type Selector10 = <T, T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6,
  v7: T7,
  v8: T8,
  v9: T9
) => R
export type Selector11 = <T, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6,
  v7: T7,
  v8: T8,
  v9: T9,
  v10: T10
) => R
export type Selector12 = <T, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R>(
  v: T,
  v1: T1,
  v2: T2,
  v3: T3,
  v4: T4,
  v5: T5,
  v6: T6,
  v7: T7,
  v8: T8,
  v9: T9,
  v10: T10,
  v11: T11
) => R

export type Selector =
  | Selector1
  | Selector2
  | Selector3
  | Selector4
  | Selector5
  | Selector6
  | Selector7
  | Selector8
  | Selector9
  | Selector10
  | Selector11
  | Selector12
export type SelectorEntry =
  | string
  | [string, Selector1]
  | [string, string, Selector2]
  | [string, string, string, Selector3]
  | [string, string, string, string, Selector4]
  | [string, string, string, string, string, Selector5]
  | [string, string, string, string, string, string, Selector6]
  | [string, string, string, string, string, string, string, Selector7]
  | [string, string, string, string, string, string, string, string, Selector8]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      Selector9
    ]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      Selector10
    ]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      Selector11
    ]
  | [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      Selector12
    ]

export interface SelectorMap {
  [key: string]: SelectorEntry
}

export interface BusinessModule {
  namespace: string
  events?: EventSchema
  reducers: StateReducerMap
  selectors: SelectorMap | string
}

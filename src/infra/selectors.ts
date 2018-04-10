import {
  Selector,
  SelectorEntry,
  SelectorMap,
  Selector1,
  Select,
  getState,
} from './types'
import { fixNSforObject, fixNSForStr } from './helpers'
import vbkp from '../liber/l/valByKeypath'
import { createSelector } from 'reselect'

export { fixNSforSelectors, resolveSelector, makeSelectFn }

interface ResolvedSelectors {
  [key: string]: Selector1
}

function fixNSforSelectors(
  ns: string,
  selectors: string | SelectorMap
): SelectorMap {
  if (typeof selectors === 'string') {
    const r: SelectorMap = {}
    const key = fixNSForStr(ns, selectors)
    r[key] = key
    return r
  } else {
    return fixNSforObject<SelectorEntry>(ns, selectors, (ns, entry) => {
      return (entry as (string | Selector)[]).map((s) => {
        if (typeof s === 'string') {
          return fixNSForStr(ns, s)
        } else {
          return s
        }
      }) as SelectorEntry
    })
  }
}

const resolvedSelectors: ResolvedSelectors = {}

function resolveSelector(selectors: SelectorMap): ResolvedSelectors {
  Object.keys(selectors).forEach((k) => {
    resolveEntry(k, selectors, resolvedSelectors)
  })
  return resolvedSelectors
}

function resolveEntry(
  selkey: string,
  selectors: SelectorMap,
  resolvedSelectors: ResolvedSelectors
): Selector1 {
  const isSelKey = selkey.charAt(selkey.length - 1) === '='
  selkey = isSelKey ? selkey.slice(0, selkey.length - 1) : selkey

  let selector = resolvedSelectors[selkey]

  if (typeof selector === 'function') {
    return selector
  }

  if (!isSelKey) {
    selector = (o) => vbkp(selkey, o)
  } else {
    const entry = selectors[selkey]
    if (entry == null) {
      throw new Error(
        `[selectors resolveEntry]invalid selector identifier ${selkey}`
      )
    } else {
      if (typeof entry === 'string') {
        selector = resolveEntry(entry, selectors, resolvedSelectors)
      } else {
        const combineFn = entry[entry.length - 1]
        const deps = (entry.slice(0, entry.length - 1) as string[]).map((k) => {
          return resolveEntry(k, selectors, resolvedSelectors)
        })
        selector = (createSelector as (
          selectors: Selector1[],
          combiner: Selector
        ) => any)(deps as Selector1[], combineFn as Selector)
      }
    }
  }

  resolvedSelectors[selkey] = selector
  return selector
}

function makeSelectFn<S>(
  getState: getState<S>,
  resolvedSelectors: ResolvedSelectors
): Select {
  return (selkey) => {
    if (!resolvedSelectors.hasOwnProperty(selkey)) {
      console.warn(`[select invoke]unknown selector key "${selkey}"`)
      return undefined
    } else {
      return resolvedSelectors[selkey](getState())
    }
  }
}

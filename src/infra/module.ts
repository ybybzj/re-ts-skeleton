import { fixNSforEventSchema } from './events'
import { fixNSforReducerMap } from './reducers'
import { fixNSforSelectors } from './selectors'
import { mergeObjsExn } from './helpers'
import mapObject from '../liber/l/mapObject'
import group from '../liber/l/group'
import map from '../liber/l/map'
import pipe from '../liber/fn/syncPipe'
import {
  EventSchema,
  StateReducerMap,
  SelectorMap,
  BusinessModule,
} from './types'

export interface ModuleWithNS {
  events: EventSchema
  reducers: { [key: string]: StateReducerMap }
  selectors: SelectorMap
}

function fixNS({
  namespace,
  events,
  reducers,
  selectors,
}: BusinessModule): ModuleWithNS {
  return {
    events: events ? fixNSforEventSchema(namespace, events) : {},
    reducers: fixNSforReducerMap(namespace, reducers),
    selectors: fixNSforSelectors(namespace, selectors),
  }
}

export function mergeModules(modules: BusinessModule[]): ModuleWithNS {
  return pipe<any, any>(
    map(fixNS),
    group(['events', 'reducers', 'selectors']) as <
      K extends keyof ModuleWithNS
    >(
      os: ModuleWithNS[]
    ) => { [k: string]: ModuleWithNS[K][] },
    mapObject(mergeObjsExn)
  )(modules)
}

import { BusinessModule, Store, StoreEnhancer, StoreCreator } from './types'
import { mergeModules, ModuleWithNS } from './module'
import { applyEnhancement } from './storeEnhancer'
import { buildReducer } from './reducers'
import { createStore, ReducersMapObject } from 'redux'

export default initStore

function initStore<T>({
  modules,
  initState,
  enhancer,
  extReducers,
}: {
  modules: BusinessModule[]
  initState?: T
  extReducers?: ReducersMapObject
  enhancer?: StoreEnhancer
}): Store<T> {
  const { events, reducers, selectors }: ModuleWithNS = mergeModules(modules)
  const reducer = buildReducer(reducers, extReducers)
  let enhancedCreateStore = createStore as StoreCreator
  enhancedCreateStore = applyEnhancement<T>(events, selectors)(
    enhancedCreateStore
  )

  if (typeof enhancer === 'function') {
    enhancedCreateStore = enhancer(enhancedCreateStore)
  }

  return enhancedCreateStore(reducer, initState)
}

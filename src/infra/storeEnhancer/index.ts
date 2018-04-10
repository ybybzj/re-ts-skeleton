import {
  EventSchema,
  SelectorMap,
  Dispatch,
  Store,
  StoreCreator,
  StoreEnhancer,
} from '../types'
import { resolveSelector, makeSelectFn } from '../selectors'
import { resolveSchema } from '../events'

export function applyEnhancement<S>(
  eventSchema: EventSchema,
  selectors: SelectorMap
): StoreEnhancer {
  return (createStore) =>
    ((...args: any[]) => {
      const store = (createStore as (...args: any[]) => Store<S>)(...args)
      const { getState, dispatch } = store
      const select = makeSelectFn(getState, resolveSelector(selectors))
      const eventHub = resolveSchema(select, eventSchema)

      //link events to store.dispatch
      eventHub.each((name) => {
        eventHub.on(name, (payload) => {
          dispatch({
            type: name,
            payload,
          })
        })
      })

      const enhanceDispatch: Dispatch<any> = (action) => {
        if (!eventHub.has(action.type)) {
          return dispatch(action)
        } else {
          eventHub.send(action.type, action.payload)
          return action
        }
      }

      return {
        ...store,
        select,
        dispatch: enhanceDispatch,
      }
    }) as StoreCreator
}

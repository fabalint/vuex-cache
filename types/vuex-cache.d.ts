import Vue from 'vue'
import {
  ActionContext,
  Dispatch,
  DispatchOptions,
  Payload,
  Store,
} from 'vuex'

export interface StoreCache {
  /**
   * Dispatch an action and set it on cache.
   */
  dispatch(type: string, payload?: any, options?: DispatchOptions): Promise<any>
  dispatch<P extends Payload>(
    payloadWithType: P,
    options?: DispatchOptions,
  ): Promise<any>

  /**
   * Check if an action is on cache.
   */
  has(type: string, payload?: any): boolean
  has<P extends Payload>(payloadWithType: P): boolean

  /**
   * Clear cache. Returns `true` if cache was cleared and `false` otherwise.
   */
  clear(): boolean
  /**
   * Partially clear cache by type. Returns the number of deleted items.
   */
  clear(type: string): number

  /**
   * Delete an action from cache. Returns `true` if it was deleted
   * and `false` otherwise.
   */
  delete(type: string, payload?: any): boolean
  delete<P extends Payload>(payloadWithType: P): boolean
}

declare module 'vuex' {
  interface DispatchOptions {
    /**
     * Cache expiration timeout.
     */
    timeout?: number
  }

  interface Payload {
    /**
     * Cache expiration timeout.
     */
    timeout?: number
  }

  interface Store<S> {
    readonly cache: StoreCache
  }
}

interface Options {
  /**
   * Cache expiration timeout.
   */
  timeout?: number
}

/**
 * An action handler with cache applied to context.
 */
type ActionHandlerWithCache<S, R> = (
  this: Store<R>,
  injectee: ActionContext<S, R> & {
    readonly cache: StoreCache
  },
  payload: any,
) => any

/**
 * Create cache with options and define it on action context instance.
 * @param action
 * @param [options]
 */
export const cacheAction: <S, R>(
  action: ActionHandlerWithCache<S, R>,
  options?: Options,
) => ActionHandlerWithCache<S, R>

/**
 * Create cache with options and define it on store instance.
 * @param options
 */
declare const createCache: (options?: Options) => (store: Store<any>) => void

export default createCache

type Actions = Record<string, (...args: any[]) => Promise<any>>

type ActionCaller = (
  this: Vue & Record<string, any>,
  dispatch: Dispatch,
  ...args: any[]
) => any

/**
 * Create cache actions object to map to a component.
 * @param namespace
 * @param actions
 */
export declare const mapCacheActions: {
  (actions: string[] | Record<string, string | ActionCaller>): Actions
  (
    namespace: string,
    actions: string[] | Record<string, string | ActionCaller>,
  ): Actions
}

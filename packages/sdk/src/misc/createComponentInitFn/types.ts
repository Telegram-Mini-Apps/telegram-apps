import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { LaunchParams } from '@/launch-params/types.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';
import type { StorageKey, StorageValue } from '@/storage/storage.js';
import type { CleanupFn, If, IsNever } from '@/types/index.js';
import type { RemoveEventListenerFn } from '@/events/types.js';

/**
 * Object, which supports tracking its state changes.
 */
export interface WithOnChange<State> {
  on(event: 'change', listener: (state: State) => void): RemoveEventListenerFn;
}

/**
 * Options passed to a component factory.
 */
export type FactoryOptions<State, SideEffects extends boolean> =
  & LaunchParams
  & { postEvent: PostEvent; createRequestId: CreateRequestIdFn }
  & If<IsNever<State>, {}, { state?: State }>
  & If<SideEffects, { addCleanup(fn: CleanupFn): void }, {}>;

export interface Factory<Result, SideEffects extends boolean, State> {
  /**
   * Creates a new component instance.
   * @param options - factory options.
   */
  (options: FactoryOptions<State, SideEffects>): Result;
}

export interface FactoryStatic<Result> extends Factory<Result, false, never> {
}

export interface FactoryDynamic<Result, SK extends StorageKey>
  extends Factory<Result, true, StorageValue<SK>> {
}

export interface InitComponentFn<Result, SideEffects extends boolean> {
  /**
   * Initializes a new static component instance.
   */
  (): If<
    SideEffects,
    [
      /**
       * Execution result.
       */
      result: Result,
      /**
       * Cleanup function.
       */
      cleanup: CleanupFn
    ],
    Result
  >;
}

export interface InitStaticComponentFn<Result> extends InitComponentFn<Result, false> {
}

export interface InitDynamicComponentFn<Result> extends InitComponentFn<Result, true> {
}

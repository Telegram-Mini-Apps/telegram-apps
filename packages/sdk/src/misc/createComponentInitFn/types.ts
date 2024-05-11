import type { PostEvent } from '@/bridge/methods/postEvent.js';
import type { LaunchParamName, PickLaunchParams } from '@/launch-params/types.js';
import type { CreateRequestIdFn } from '@/request-id/types.js';
import type { StorageKey, StorageValue } from '@/storage/storage.js';
import type { If, IsNever } from '@/types/index.js';

/**
 * Object, which supports tracking its state changes.
 */
export interface WithOnChange<State> {
  on(event: 'change', listener: (state: State) => void): void;
}

type LaunchParamsWithState<LP extends LaunchParamName, State> =
  & PickLaunchParams<LP>
  & If<IsNever<State>, {}, { state?: State }>;

export type SSROptions<LP extends LaunchParamName, State> = LaunchParamsWithState<LP, State>;

/**
 * Options passed to a component factory.
 */
export type FactoryOptions<LP extends LaunchParamName, State> =
  & LaunchParamsWithState<LP, State>
  & { postEvent: PostEvent; createRequestId: CreateRequestIdFn };

export interface Factory<LP extends LaunchParamName, R, State> {
  /**
   * Creates new component instance.
   * @param options - factory options.
   */
  (options: FactoryOptions<LP, State>): R;
}

export interface FactoryStatic<LP extends LaunchParamName, R>
  extends Factory<LP, R, never> {
}

export interface FactoryDynamic<
  LP extends LaunchParamName,
  R,
  SK extends StorageKey,
> extends Factory<LP, R, StorageValue<SK>> {
}

export interface InitComponentFn<LP extends LaunchParamName, Result, State> {
  /**
   * Initializes new component instance.
   * @param options - initialization options.
   */
  (options?: {
    /**
     * Options, applicable only to SSR mode.
     */
    ssr?: SSROptions<LP, State>;
  }): Result;
}

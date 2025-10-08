import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import type { Computed } from '@tma.js/signals';
import type { PostEventError, MethodName, MethodParams } from '@tma.js/bridge';

import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import { createWithChecksFp, type WithChecksFp, type WithChecks } from '@/wrappers/withChecksFp.js';
import { throwifyWithChecksFp } from '@/wrappers/throwifyWithChecksFp.js';
import type { WithVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';
import { removeUndefined } from '@/helpers/removeUndefined.js';
import { shallowEqual } from '@/helpers/shallowEqual.js';

export interface ButtonState {
  isVisible: boolean;
}

type ButtonError = PostEventError;

export interface ButtonOptions<S extends ButtonState, M extends MethodName>
  extends SharedFeatureOptions,
  WithStateRestore<S>,
  WithVersionBasedPostEvent {
  /**
   * The initial button state.
   */
  initialState: S;
  /**
   * Removes a component click listener.
   * @param listener - a listener to remove.
   * @param once - should the listener be called only once.
   */
  offClick: (listener: VoidFunction, once?: boolean) => void;
  /**
   * Adds a component click listener.
   * @returns A function to remove listener.
   * @param listener - a listener to add.
   * @param once - should the listener be called only once.
   */
  onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;
  /**
   * A Mini Apps method to commit changes.
   */
  method: M;
  /**
   * A function to create method payload.
   * @param state
   */
  payload: (state: S) => MethodParams<M>;
}

export class Button<S extends ButtonState, M extends MethodName> {
  constructor({
    isTma,
    storage,
    onClick,
    offClick,
    initialState,
    isPageReload,
    postEvent,
    payload,
    method,
    version,
  }: ButtonOptions<S, M>) {
    const stateful = new Stateful({
      initialState,
      onChange(state) {
        storage.set(state);
      },
    });
    const mountable = new Mountable<S>({
      initialState,
      isPageReload,
      onMounted: bound(stateful, 'setState'),
      restoreState: storage.get,
    });

    const setVisibility = (isVisible: boolean) => {
      return this.setState({ isVisible } as Partial<S>);
    };

    this.isVisible = stateful.computedFromState('isVisible');
    this.isMounted = mountable.isMounted;
    this.state = stateful.state;
    this.setState = state => {
      const nextState = { ...stateful.state(), ...removeUndefined(state) };
      return shallowEqual(nextState, stateful.state())
        ? E.right(undefined)
        : pipe(
          postEvent(method as any, payload(nextState)),
          E.map(() => {
            stateful.setState(nextState);
          }),
        );
    };

    const wrapOptions = { version, isSupported: method, isTma };
    const wrapSupportedPlain = createWithChecksFp({
      ...wrapOptions,
      returns: 'plain',
    });
    const wrapMountedEither = createWithChecksFp({
      ...wrapOptions,
      returns: 'either',
      isMounted: mountable.isMounted,
    });

    this.isVisible = stateful.computedFromState('isVisible');
    this.isMounted = mountable.isMounted;
    this.isSupported = createIsSupportedSignal(method, version);
    this.state = stateful.state;

    this.hideFp = wrapMountedEither(() => setVisibility(false));
    this.showFp = wrapMountedEither(() => setVisibility(true));
    this.onClickFp = wrapSupportedPlain(onClick);
    this.offClickFp = wrapSupportedPlain(offClick);
    this.mountFp = wrapSupportedPlain(mountable.mount);
    this.unmount = mountable.unmount;

    this.hide = throwifyWithChecksFp(this.hideFp);
    this.show = throwifyWithChecksFp(this.showFp);
    this.onClick = throwifyWithChecksFp(this.onClickFp);
    this.offClick = throwifyWithChecksFp(this.offClickFp);
    this.mount = throwifyWithChecksFp(this.mountFp);
  }

  /**
   * Signal indicating if the component is currently visible.
   */
  readonly isVisible: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Complete button state.
   */
  readonly state: Computed<S>;

  /**
   * Updates the button state.
   */
  readonly setState: (state: Partial<S>) => E.Either<ButtonError, void>;

  /**
   * Hides the button.
   */
  readonly hideFp: WithChecksFp<() => E.Either<ButtonError, void>, true>;

  /**
   * @see hideFp
   */
  readonly hide: WithChecks<() => void, true>;

  /**
   * Shows the button.
   */
  readonly showFp: WithChecksFp<() => E.Either<ButtonError, void>, true>;

  /**
   * @see showFp
   */
  readonly show: WithChecks<() => void, true>;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @example
   * const off = button.onClick(() => {
   *   console.log('User clicked the button');
   *   off();
   * });
   */
  readonly onClickFp: WithChecksFp<
    (listener: VoidFunction, once?: boolean) => VoidFunction,
    true
  >;

  /**
   * @see onClickFp
   */
  readonly onClick: WithChecks<(listener: VoidFunction, once?: boolean) => VoidFunction, true>;

  /**
   * Removes the button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @example
   * function listener() {
   *   console.log('User clicked the button');
   *   button.offClick(listener);
   * }
   * button.onClick(listener);
   */
  readonly offClickFp: WithChecksFp<
    (listener: VoidFunction, once?: boolean) => void,
    true
  >;

  /**
   * @see offClickFp
   */
  readonly offClick: WithChecks<(listener: VoidFunction, once?: boolean) => void, true>;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v6.1
   */
  readonly mountFp: WithChecksFp<() => void, true>;

  /**
   * @see mountFp
   */
  readonly mount: WithChecks<() => void, true>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}

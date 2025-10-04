import type { Computed } from '@tma.js/signals';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { Mountable } from '@/composables/Mountable.js';
import { Stateful } from '@/composables/Stateful.js';
import { bound } from '@/helpers/bound.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';
import { removeUndefined } from '@/helpers/removeUndefined.js';

export interface ButtonState {
  isVisible: boolean;
}

export interface ButtonOptions<S, Err> extends WithStateRestore<S> {
  /**
   * A function to commit the button state. This one will be called every time the button state
   * changes.
   * @param state - the actual state.
   */
  commit: (state: S) => E.Either<Err, void>;
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
}

export class Button<S extends ButtonState, Err> {
  constructor({
    storage,
    onClick,
    offClick,
    initialState,
    isPageReload,
    commit,
  }: ButtonOptions<S, Err>) {
    const stateful = new Stateful({
      initialState,
      onChange: storage.set,
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
      return pipe(
        commit(nextState),
        E.map(() => {
          stateful.setState(nextState);
        }),
      );
    };
    this.mount = bound(mountable, 'mount');
    this.unmount = bound(mountable, 'unmount');
    this.onClick = onClick;
    this.offClick = offClick;
    this.hide = () => setVisibility(false);
    this.show = () => setVisibility(true);
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
   * Complete button state.
   */
  readonly state: Computed<S>;

  /**
   * Updates the button state.
   */
  readonly setState: (state: Partial<S>) => E.Either<Err, void>;

  /**
   * Hides the button.
   */
  readonly hide: () => E.Either<Err, void>;

  /**
   * Shows the button.
   */
  readonly show: () => E.Either<Err, void>;

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
  readonly onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;

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
  readonly offClick: (listener: VoidFunction, once?: boolean) => void;

  /**
   * Mounts the component restoring its state.
   */
  readonly mount: () => void;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}

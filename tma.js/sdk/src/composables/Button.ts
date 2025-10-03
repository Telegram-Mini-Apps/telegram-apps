import type { Computed } from '@tma.js/signals';

import { Mountable } from '@/composables/Mountable.js';
import { Stateful } from '@/composables/Stateful.js';
import { bound } from '@/helpers/bound.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';

export interface ButtonState {
  isVisible: boolean;
}

export interface ButtonOptions<S> extends WithStateRestore<S> {
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
   * A function to call whenever the button state changes.
   * @param state - updated state.
   */
  onChange: (state: S) => void;
  /**
   * Adds a component click listener.
   * @returns A function to remove listener.
   * @param listener - a listener to add.
   * @param once - should the listener be called only once.
   */
  onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;
}

export class Button<S extends ButtonState> {
  constructor({
    storage,
    onClick,
    offClick,
    initialState,
    onChange,
    isPageReload,
  }: ButtonOptions<S>) {
    const stateful = new Stateful({
      initialState,
      onChange(state) {
        storage.set(state);
        onChange(state);
      },
    });
    const mountable = new Mountable<S>({
      initialState,
      isPageReload,
      onMounted: bound(stateful, 'setState'),
      restoreState: storage.get,
    });

    this.isVisible = stateful.computedFromState('isVisible');
    this.isMounted = mountable.isMounted;
    this.state = stateful.state;
    this.setState = bound(stateful, 'setState');
    this.mount = bound(mountable, 'mount');
    this.unmount = bound(mountable, 'unmount');
    this.onClick = onClick;
    this.offClick = offClick;
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
  readonly setState: (state: Partial<S>) => void;

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

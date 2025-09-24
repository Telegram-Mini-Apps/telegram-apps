import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { ComponentStorage } from '@/component-storage.js';
import type { SharedFeatureOptions, WithIsPageReload, WithStorage } from '@/features/types.js';
import { Mountable } from '@/composables/Mountable.js';
import { Stateful } from '@/composables/Stateful.js';
import { bound } from '@/helpers/bound.js';

export interface ButtonState {
  isVisible: boolean;
}

export interface ButtonOptions<S> extends WithStorage<ComponentStorage<S>>,
  WithIsPageReload,
  SharedFeatureOptions {
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
    isTma,
    onClick,
    offClick,
    initialState,
    onChange,
    isPageReload,
  }: ButtonOptions<S>) {
    const wrapSupported = createWrapSafe({ isTma });

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
    this.setState = wrapSupported(bound(stateful, 'setState'));
    this.mount = wrapSupported(bound(mountable, 'mount'));
    this.unmount = bound(mountable, 'unmount');
    this.onClick = wrapSupported(onClick);
    this.offClick = wrapSupported(offClick);
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
  readonly setState: SafeWrapped<(state: Partial<S>) => void, false>;

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
  readonly onClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => VoidFunction, false>;

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
  readonly offClick: SafeWrapped<(listener: VoidFunction, once?: boolean) => void, false>;

  /**
   * Mounts the component restoring its state.
   */
  readonly mount: SafeWrapped<() => void, false>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}

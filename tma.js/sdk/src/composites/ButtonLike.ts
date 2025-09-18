import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedFeatureOptions,
  WithOnClickListener,
  WithStorage,
} from '@/features/types.js';
import { Mountable } from '@/composites/Mountable.js';
import { Stateful } from '@/composites/Stateful.js';

export interface ButtonLikeState {
  isVisible: boolean;
}

export interface ButtonLikeOptions<S> extends WithStorage<ComponentStorage<S>>,
  WithOnClickListener,
  SharedFeatureOptions {
  /**
   * The initial button state.
   */
  initialState: S;
  /**
   * A function to call whenever the button state changes.
   * @param state - updated state.
   */
  onChange: (state: S) => void;
}

export class ButtonLike<S extends ButtonLikeState> {
  constructor({
    storage,
    isTma,
    onClick,
    offClick,
    initialState,
    onChange,
  }: ButtonLikeOptions<S>) {
    const wrapSupported = createWrapSafe({ isTma });

    this.stateful = new Stateful({
      initialState,
      onChange(state) {
        storage.set(state);
        onChange(state);
      },
    });
    this.setState = this.stateful.setState.bind(this.stateful);
    this.isVisible = this.stateful.computedFromState('isVisible');

    this.mountable = new Mountable({
      onBeforeMounted: state => {
        if (state) {
          this.stateful.setState(state);
        }
      },
      restoreState: storage.get,
      isTma,
    });
    this.isMounted = this.mountable.isMounted;
    this.mount = this.mountable.mount.bind(this.mountable);
    this.unmount = this.mountable.unmount.bind(this.mountable);

    this.onClick = wrapSupported(onClick);
    this.offClick = wrapSupported(offClick);
  }

  private readonly stateful: Stateful<S>;

  private readonly mountable: Mountable<S>;

  /**
   * Updates the button state.
   */
  readonly setState: (state: Partial<S>) => void;

  /**
   * Signal indicating if the component is currently visible.
   */
  readonly isVisible: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

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

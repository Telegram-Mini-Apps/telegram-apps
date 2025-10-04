import type { Computed } from '@tma.js/signals';

import { type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { BackButtonFp } from '@/features/BackButton/BackButtonFp.js';
import { unwrapFp } from '@/wrappers/unwrapFp.js';
import type { BackButtonOptions } from '@/features/BackButton/types.js';

/**
 * @since Mini Apps v6.1
 */
export class BackButton {
  constructor(options: BackButtonOptions) {
    const parent = new BackButtonFp(options);

    this.isVisible = parent.isVisible;
    this.isMounted = parent.isMounted;
    this.isSupported = parent.isSupported;
    this.hide = unwrapFp(parent.hide);
    this.show = unwrapFp(parent.show);
    this.onClick = unwrapFp(parent.onClick);
    this.offClick = unwrapFp(parent.offClick);
    this.mount = unwrapFp(parent.mount);
    this.unmount = parent.unmount;
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
   * Hides the back button.
   * @since Mini Apps v6.1
   */
  readonly hide: SafeWrapped<() => void, true>;

  /**
   * Shows the back button.
   * @since Mini Apps v6.1
   */
  readonly show: SafeWrapped<() => void, true>;

  /**
   * Adds a new button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v6.1
   * @example
   * const off = button.onClick(() => {
   *   console.log('User clicked the button');
   *   off();
   * });
   */
  readonly onClick: SafeWrapped<
    (listener: VoidFunction, once?: boolean) => VoidFunction,
    true
  >;

  /**
   * Removes the button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @since Mini Apps v6.1
   * @example
   * function listener() {
   *   console.log('User clicked the button');
   *   button.offClick(listener);
   * }
   * button.onClick(listener);
   */
  readonly offClick: SafeWrapped<
    (listener: VoidFunction, once?: boolean) => void,
    true
  >;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v6.1
   */
  readonly mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  readonly unmount: () => void;
}

import { computed, type Computed, signal } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedComponentOptions,
  WithOnClickListener,
  WithPostEvent,
  WithStorage,
  WithVersion,
} from '@/features/types.js';

export type BackButtonStorage = ComponentStorage<{ isVisible: boolean }>;

export interface BackButtonOptions extends WithVersion,
  WithStorage<BackButtonStorage>,
  WithPostEvent,
  WithOnClickListener,
  SharedComponentOptions {
}

/**
 * @since Mini Apps v6.1
 */
export class BackButton {
  constructor({ version, postEvent, storage, isTma, onClick, offClick }: BackButtonOptions) {
    const isMounted = signal(false);
    const isVisible = signal(false);
    const wrapOptions = { version, isSupported: 'web_app_setup_back_button', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({ ...wrapOptions, isMounted });

    const setVisibility = (value: boolean): void => {
      if (value !== isVisible()) {
        postEvent('web_app_setup_back_button', { is_visible: value });
        storage.set({ isVisible: value });
        isVisible.set(value);
      }
    };

    this.isSupported = createIsSupportedSignal('web_app_setup_back_button', version);
    this.isVisible = computed(isVisible);
    this.isMounted = computed(isMounted);
    this.hide = wrapComplete(() => setVisibility(false));
    this.show = wrapComplete(() => setVisibility(true));
    this.onClick = wrapSupported(onClick);
    this.offClick = wrapSupported(offClick);
    this.mount = wrapSupported(() => {
      if (!isMounted()) {
        const state = isPageReload() ? storage.get() : undefined;
        if (state) {
          isVisible.set(state.isVisible);
        }
        isMounted.set(true);
      }
    });
    this.unmount = () => {
      isMounted.set(false);
    };
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
   * Mounts the component restoring its state.
   * @since Mini Apps v6.1
   */
  mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  unmount: () => void;

  /**
   * Hides the back button.
   * @since Mini Apps v6.1
   */
  hide: SafeWrapped<() => void, true>;

  /**
   * Shows the back button.
   * @since Mini Apps v6.1
   */
  show: SafeWrapped<() => void, true>;

  /**
   * Adds a new back button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v6.1
   * @example
   * const off = backButton.onClick(() => {
   *   console.log('User clicked the back button');
   *   off();
   * });
   */
  onClick: SafeWrapped<(listener: () => void, once?: boolean) => VoidFunction, true>;

  /**
   * Removes the back button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @since Mini Apps v6.1
   * @example
   * function listener() {
   *   console.log('User clicked the back button');
   *   backButton.offClick(listener);
   * }
   * backButton.onClick(listener);
   */
  offClick: SafeWrapped<(listener: () => void, once?: boolean) => void, true>;
}

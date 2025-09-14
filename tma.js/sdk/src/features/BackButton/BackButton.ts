import { computed, type Computed, signal } from '@tma.js/signals';
import { type PostEventFpFn, on, off } from '@tma.js/bridge';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedComponentOptions,
  WithPostEvent,
  WithStorage,
  WithVersion,
} from '@/features/types.js';

export type BackButtonStorage = ComponentStorage<{ isVisible: boolean }>;

export interface BackButtonOptions extends WithVersion,
  WithPostEvent,
  WithStorage<BackButtonStorage>,
  WithPostEvent,
  SharedComponentOptions {
}

const SETUP_METHOD_NAME = 'web_app_setup_back_button';

/**
 * @since Mini Apps v6.1
 */
export class BackButton {
  private readonly postEvent: PostEventFpFn;

  private readonly storage: BackButtonStorage;

  private readonly _isVisible = signal(false);

  private readonly _isMounted = signal(false);

  /**
   * Signal indicating if the Back Button is currently visible.
   */
  readonly isVisible = computed(this._isVisible);

  /**
   * Signal indicating if the Back Button is currently mounted.
   */
  readonly isMounted = computed(this._isMounted);

  /**
   * Signal indicating if the Back Button is supported.
   */
  readonly isSupported: Computed<boolean>;

  constructor({ version, postEvent, storage, isTma }: BackButtonOptions) {
    this.isSupported = createIsSupportedSignal(SETUP_METHOD_NAME, version);
    this.storage = storage;
    this.postEvent = postEvent;

    const wrapOptions = { version, isSupported: SETUP_METHOD_NAME, isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: this._isMounted,
    });

    this.hide = wrapComplete(() => this.setVisibility(false));
    this.show = wrapComplete(() => this.setVisibility(true));
    this.onClick = wrapSupported((listener, once) => {
      return on('back_button_pressed', listener, once);
    });
    this.offClick = wrapSupported((listener, once) => {
      off('back_button_pressed', listener, once);
    });
    this.mount = wrapSupported(() => {
      if (!this._isMounted()) {
        this.storage.set((isPageReload() ? this.storage.get() : undefined) || { isVisible: false });
        this._isMounted.set(true);
      }
    });
  }

  private setVisibility(isVisible: boolean): void {
    if (isVisible !== this._isVisible()) {
      this.postEvent(SETUP_METHOD_NAME, { is_visible: isVisible });
      this.storage.set({ isVisible });
      this._isVisible.set(isVisible);
    }
  }

  /**
   * Mounts the Back Button restoring its state.
   * @since Mini Apps v6.1
   */
  mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the Back Button.
   *
   * Note that this function does not remove listeners added via the `onClick`
   * function, so you have to remove them on your own.
   * @see onClick
   */
  unmount() {
    this._isMounted.set(false);
  }

  /**
   * Hides the Back Button.
   * @since Mini Apps v6.1
   */
  hide: SafeWrapped<() => void, true>;

  /**
   * Shows the Back Button.
   * @since Mini Apps v6.1
   */
  show: SafeWrapped<() => void, true>;

  /**
   * Adds a new Back Button listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @returns A function to remove bound listener.
   * @since Mini Apps v6.1
   * @example
   * const off = backButton.onClick(() => {
   *   console.log('User clicked the Back Button');
   *   off();
   * });
   */
  onClick: SafeWrapped<(listener: () => void, once?: boolean) => VoidFunction, true>;

  /**
   * Removes the Back Button click listener.
   * @param listener - event listener.
   * @param once - should the listener be called only once.
   * @since Mini Apps v6.1
   * @example
   * function listener() {
   *   console.log('User clicked the Back Button');
   *   backButton.offClick(listener);
   * }
   * backButton.onClick(listener);
   */
  offClick: SafeWrapped<(listener: () => void, once?: boolean) => void, true>;
}

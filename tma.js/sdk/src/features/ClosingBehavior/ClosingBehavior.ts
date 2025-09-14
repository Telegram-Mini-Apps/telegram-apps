import { computed, signal } from '@tma.js/signals';
import type { PostEventFpFn } from '@tma.js/bridge';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { isPageReload } from '@/navigation.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedComponentOptions,
  WithPostEvent,
  WithStorage,
} from '@/features/types.js';

export type ClosingBehaviorStorage = ComponentStorage<{ isConfirmationEnabled: boolean }>;

export interface ClosingBehaviorOptions extends WithStorage<ClosingBehaviorStorage>,
  WithPostEvent,
  SharedComponentOptions {
}

const SETUP_METHOD_NAME = 'web_app_setup_closing_behavior';

export class ClosingBehavior {
  private readonly postEvent: PostEventFpFn;

  private readonly storage: ClosingBehaviorStorage;

  private readonly _isConfirmationEnabled = signal(false);

  private readonly _isMounted = signal(false);

  /**
   * Signal indicating if closing confirmation dialog is currently enabled.
   */
  readonly isConfirmationEnabled = computed(this._isConfirmationEnabled);

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted = computed(this._isMounted);

  constructor({ postEvent, storage, isTma }: ClosingBehaviorOptions) {
    this.storage = storage;
    this.postEvent = postEvent;

    const wrapOptions = { isSupported: SETUP_METHOD_NAME, isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: this._isMounted,
    });

    this.disableConfirmation = wrapComplete(() => this.setClosingConfirmation(false));
    this.enableConfirmation = wrapComplete(() => this.setClosingConfirmation(true));
    this.mount = wrapSupported(() => {
      if (!this._isMounted()) {
        this.storage.set(
          (isPageReload() ? this.storage.get() : undefined)
          || { isConfirmationEnabled: false },
        );
        this._isMounted.set(true);
      }
    });
  }

  private setClosingConfirmation(value: boolean): void {
    if (value !== this._isConfirmationEnabled()) {
      this.postEvent(SETUP_METHOD_NAME, { need_confirmation: value });
      this.storage.set({ isConfirmationEnabled: value });
      this._isConfirmationEnabled.set(value);
    }
  }

  /**
   * Mounts the component restoring its state.
   */
  mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   */
  unmount() {
    this._isMounted.set(false);
  }

  /**
   * Disables the closing confirmation dialog.
   */
  disableConfirmation: SafeWrapped<() => void, true>;

  /**
   * Enables the closing confirmation dialog.
   */
  enableConfirmation: SafeWrapped<() => void, true>;
}

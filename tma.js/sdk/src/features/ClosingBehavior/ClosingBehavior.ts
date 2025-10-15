import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedFeatureOptions,
  WithIsPageReload,
  WithPostEvent,
  WithStorage,
} from '@/features/types.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';

export interface ClosingBehaviorOptions
  extends WithStorage<ComponentStorage<{ isConfirmationEnabled: boolean }>>,
  WithPostEvent,
  WithIsPageReload,
  SharedFeatureOptions {
}

export class ClosingBehavior {
  constructor({ postEvent, storage, isTma, isPageReload }: ClosingBehaviorOptions) {
    const stateful = new Stateful({
      initialState: { isConfirmationEnabled: false },
      onChange(state) {
        storage.set(state);
        postEvent('web_app_setup_closing_behavior', {
          need_confirmation: state.isConfirmationEnabled,
        });
      },
    });
    const mountable = new Mountable({
      onMounted: bound(stateful, 'setState'),
      restoreState: storage.get,
      initialState: { isConfirmationEnabled: false },
      isPageReload,
    });

    const wrapOptions = { isSupported: 'web_app_setup_closing_behavior', isTma } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: mountable.isMounted,
    });

    const setClosingConfirmation = (isConfirmationEnabled: boolean): void => {
      stateful.setState({ isConfirmationEnabled });
    };

    this.isConfirmationEnabled = stateful.computedFromState('isConfirmationEnabled');
    this.isMounted = mountable.isMounted;
    this.disableConfirmation = wrapComplete(() => setClosingConfirmation(false));
    this.enableConfirmation = wrapComplete(() => setClosingConfirmation(true));
    this.mount = wrapSupported(bound(mountable, 'mount'));
    this.unmount = bound(mountable, 'unmount');
  }

  /**
   * Signal indicating if closing confirmation dialog is currently enabled.
   */
  readonly isConfirmationEnabled: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Mounts the component restoring its state.
   */
  mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   */
  unmount: () => void;

  /**
   * Disables the closing confirmation dialog.
   */
  disableConfirmation: SafeWrapped<() => void, true>;

  /**
   * Enables the closing confirmation dialog.
   */
  enableConfirmation: SafeWrapped<() => void, true>;
}

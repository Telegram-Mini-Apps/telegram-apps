import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';
import type { WithStateRestore } from '@/fn-options/withStateRestore.js';
import type { WithPostEvent } from '@/fn-options/withPostEvent.js';
import type { SharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';

export interface ClosingBehaviorState {
  isConfirmationEnabled: boolean;
}

export interface ClosingBehaviorOptions
  extends WithStateRestore<ClosingBehaviorState>,
  WithPostEvent,
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
    const wrapSafe = createWrapSafe(wrapOptions);
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
    this.mount = wrapSafe(bound(mountable, 'mount'));
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
  mount: SafeWrapped<() => void, false>;

  /**
   * Unmounts the component.
   */
  unmount: () => void;

  /**
   * Disables the closing confirmation dialog.
   */
  disableConfirmation: SafeWrapped<() => void, false>;

  /**
   * Enables the closing confirmation dialog.
   */
  enableConfirmation: SafeWrapped<() => void, false>;
}

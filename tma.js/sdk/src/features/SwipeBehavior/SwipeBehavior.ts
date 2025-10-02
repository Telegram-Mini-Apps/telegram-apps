import type { Computed } from '@tma.js/signals';

import { createWrapSafe, type SafeWrapped } from '@/wrappers/wrapSafe.js';
import type { ComponentStorage } from '@/component-storage.js';
import type {
  SharedFeatureOptions,
  WithIsPageReload,
  WithPostEvent,
  WithStorage, WithVersion,
} from '@/features/mixins.js';
import { Stateful } from '@/composables/Stateful.js';
import { Mountable } from '@/composables/Mountable.js';
import { bound } from '@/helpers/bound.js';
import { createIsSupportedSignal } from '@/helpers/createIsSupportedSignal.js';

export interface SwipeBehaviorOptions
  extends WithStorage<ComponentStorage<{ isVerticalEnabled: boolean }>>,
  WithPostEvent,
  WithIsPageReload,
  WithVersion,
  SharedFeatureOptions {
}

/**
 * @since Mini Apps v7.7
 */
export class SwipeBehavior {
  constructor({ postEvent, storage, isTma, isPageReload, version }: SwipeBehaviorOptions) {
    const stateful = new Stateful({
      initialState: { isVerticalEnabled: false },
      onChange(state) {
        storage.set(state);
        postEvent('web_app_setup_swipe_behavior', {
          allow_vertical_swipe: state.isVerticalEnabled,
        });
      },
    });
    const mountable = new Mountable({
      initialState: { isVerticalEnabled: false },
      isPageReload,
      onMounted: bound(stateful, 'setState'),
      restoreState: storage.get,
    });

    const wrapOptions = {
      isSupported: 'web_app_setup_swipe_behavior',
      isTma,
      version,
    } as const;
    const wrapSupported = createWrapSafe(wrapOptions);
    const wrapComplete = createWrapSafe({
      ...wrapOptions,
      isMounted: mountable.isMounted,
    });

    const setVerticalEnabled = (isVerticalEnabled: boolean): void => {
      stateful.setState({ isVerticalEnabled });
    };

    this.isSupported = createIsSupportedSignal('web_app_setup_swipe_behavior', version);
    this.isVerticalEnabled = stateful.computedFromState('isVerticalEnabled');
    this.isMounted = mountable.isMounted;
    this.disableVertical = wrapComplete(() => setVerticalEnabled(false));
    this.enableVertical = wrapComplete(() => setVerticalEnabled(true));
    this.mount = wrapSupported(bound(mountable, 'mount'));
    this.unmount = bound(mountable, 'unmount');
  }

  /**
   * Signal indicating if the component is supported.
   */
  readonly isSupported: Computed<boolean>;

  /**
   * Signal indicating if vertical swipes are enabled.
   */
  readonly isVerticalEnabled: Computed<boolean>;

  /**
   * Signal indicating if the component is currently mounted.
   */
  readonly isMounted: Computed<boolean>;

  /**
   * Mounts the component restoring its state.
   * @since Mini Apps v7.7
   */
  mount: SafeWrapped<() => void, true>;

  /**
   * Unmounts the component.
   */
  unmount: () => void;

  /**
   * Disables the closing confirmation dialog.
   * @since Mini Apps v7.7
   */
  disableVertical: SafeWrapped<() => void, true>;

  /**
   * Enables the closing confirmation dialog.
   * @since Mini Apps v7.7
   */
  enableVertical: SafeWrapped<() => void, true>;
}

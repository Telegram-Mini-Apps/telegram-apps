import { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';
import { computed } from '@/signals/computed/computed.js';

import { state as _state } from './initData.private.js';

/*
 * fixme
 * @see Usage: https://docs.telegram-mini-apps.com/platform/init-data
 * @see API: https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/init-data
 */

export const state = computed(_state);

/**
 * Restores the component state.
 */
export function restore(): void {
  _state.set(retrieveLaunchParams().initData);
}

export * from './initData.computed.js';

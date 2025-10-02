import { off, on, type EventName } from '@tma.js/bridge';

import { createFnOption } from '@/fn-options/createFnOption.js';

export function withClickListeners(trackedEvent: EventName) {
  return createFnOption({
    onClick(listener: VoidFunction, once?: boolean): VoidFunction {
      return on(trackedEvent, listener, once);
    },
    offClick(listener: VoidFunction, once?: boolean): void {
      off(trackedEvent, listener, once);
    },
  });
}

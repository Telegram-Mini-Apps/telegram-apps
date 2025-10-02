import { off, on, type EventName } from '@tma.js/bridge';

import { createFnOption } from '@/fn-options/createFnOption.js';

export interface WithClickListeners {
  onClick: (listener: VoidFunction, once?: boolean) => VoidFunction;
  offClick: (listener: VoidFunction, once?: boolean) => void;
}

export function withClickListeners(trackedEvent: EventName) {
  return createFnOption<WithClickListeners>({
    onClick(listener, once): VoidFunction {
      return on(trackedEvent, listener, once);
    },
    offClick(listener, once) {
      off(trackedEvent, listener, once);
    },
  });
}

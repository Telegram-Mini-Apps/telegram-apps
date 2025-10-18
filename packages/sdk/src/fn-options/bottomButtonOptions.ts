import type { EventName } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';

import { buttonOptions } from '@/fn-options/buttonOptions.js';

export function bottomButtonOptions<S, D>(
  storageName: string,
  trackedClickEvent: EventName,
  defaults: D,
) {
  return pipe(
    buttonOptions<S>(storageName, trackedClickEvent),
    obj => ({ ...obj, defaults }),
  );
}

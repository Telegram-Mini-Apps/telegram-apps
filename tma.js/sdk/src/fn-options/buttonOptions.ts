import type { EventName } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';

import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';
import { withClickListeners } from '@/fn-options/withClickListeners.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';

export function buttonOptions<S>(storageName: string, trackedClickEvent: EventName) {
  return pipe(
    sharedFeatureOptions(),
    withVersionBasedPostEvent,
    withStateRestore<S>(storageName),
    withClickListeners(trackedClickEvent),
  );
}

import { on, off } from '@tma.js/bridge';
import { pipe } from 'fp-ts/function';

import {
  sharedFeatureOptions,
  withPostEvent,
  withRequest,
  withStateRestore,
  withVersion,
} from '@/features/mixins.js';
import { Biometry } from '@/features/Biometry/Biometry.js';
import type { BiometryState } from '@/features/Biometry/types.js';

/**
 * @internal
 */
export function instantiateBiometry() {
  return new Biometry({
    ...pipe(
      sharedFeatureOptions(),
      withVersion,
      withPostEvent,
      withRequest,
      withStateRestore<BiometryState>('biometry'),
    ),
    offInfoReceived(listener) {
      off('biometry_info_received', listener);
    },
    onInfoReceived(listener) {
      return on('biometry_info_received', listener);
    },
  });
}

export const biometry = instantiateBiometry();

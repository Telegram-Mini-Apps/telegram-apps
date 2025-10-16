import { pipe } from 'fp-ts/function';

import { LocationManager } from '@/features/LocationManager/LocationManager.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersionBasedPostEvent } from '@/fn-options/withVersionBasedPostEvent.js';
import { withRequest } from '@/fn-options/withRequest.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';
import type { LocationManagerState } from '@/features/LocationManager/types.js';

export const locationManager = new LocationManager(pipe(
  sharedFeatureOptions(),
  withVersionBasedPostEvent,
  withRequest,
  withStateRestore<LocationManagerState>('locationManager'),
));

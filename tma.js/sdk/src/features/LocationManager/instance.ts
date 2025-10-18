import { pipe } from 'fp-ts/function';

import { LocationManager } from '@/features/LocationManager/LocationManager.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withRequest } from '@/fn-options/withRequest.js';
import { withStateRestore } from '@/fn-options/withStateRestore.js';
import type { LocationManagerState } from '@/features/LocationManager/types.js';
import { withPostEvent } from '@/fn-options/withPostEvent.js';
import { withVersion } from '@/fn-options/withVersion.js';

export const locationManager = new LocationManager(pipe(
  sharedFeatureOptions(),
  withPostEvent,
  withVersion,
  withRequest,
  withStateRestore<LocationManagerState>('locationManager'),
));

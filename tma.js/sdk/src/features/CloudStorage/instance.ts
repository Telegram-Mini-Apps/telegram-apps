import { pipe } from 'fp-ts/function';

import { CloudStorage } from '@/features/CloudStorage/CloudStorage.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersion } from '@/fn-options/withVersion.js';
import { withInvokeCustomMethod } from '@/fn-options/withInvokeCustomMethod.js';

export const cloudStorage = new CloudStorage(pipe(
  sharedFeatureOptions(),
  withVersion,
  withInvokeCustomMethod,
));

import { pipe } from 'fp-ts/function';

import { CloudStorage } from '@/features/CloudStorage/CloudStorage.js';
import { sharedFeatureOptions } from '@/fn-options/sharedFeatureOptions.js';
import { withVersion } from '@/fn-options/withVersion.js';
import { withInvokeCustomMethod } from '@/fn-options/withInvokeCustomMethod.js';

/**
 * @internal
 */
export function instantiateCloudStorage() {
  return new CloudStorage(pipe(
    sharedFeatureOptions(),
    withVersion,
    withInvokeCustomMethod,
  ));
}

export const cloudStorage = instantiateCloudStorage();

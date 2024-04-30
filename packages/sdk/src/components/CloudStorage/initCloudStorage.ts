import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { CloudStorage } from './CloudStorage.js';

/**
 * @returns A new initialized instance of the `CloudStorage` class.
 * @see CloudStorage
 */
export const initCloudStorage = createInitFn<CloudStorage, 'version'>(
  ({ createRequestId, postEvent, version }) => {
    return new CloudStorage(version, createRequestId, postEvent);
  },
);

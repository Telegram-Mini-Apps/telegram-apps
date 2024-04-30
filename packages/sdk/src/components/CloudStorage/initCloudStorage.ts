import { createComponentInitFn } from '@/init/createComponentInitFn/createComponentInitFn.js';

import { CloudStorage } from './CloudStorage.js';

/**
 * @returns A new initialized instance of the `CloudStorage` class.
 * @see CloudStorage
 */
export const initCloudStorage = createComponentInitFn<CloudStorage, 'version'>(
  ({ createRequestId, postEvent, version }) => {
    return new CloudStorage(version, createRequestId, postEvent);
  },
);

import { CloudStorage } from '@/components/cloud-storage/CloudStorage.js';
import { createInitFn } from '@/components/createInitFn.js';

/**
 * @returns A new initialized instance of CloudStorage class.
 */
export const initCloudStorage = createInitFn(
  ({ createRequestId, postEvent, version }) => {
    return new CloudStorage(version, createRequestId, postEvent);
  },
);

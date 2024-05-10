import { initCloudStorage } from '@tma.js/sdk';

import { createHOCs } from '../createHOCs.js';
import { createHooks } from '../createHooks.js';

export const [useCloudStorageRaw, useCloudStorage] = createHooks(initCloudStorage);

export const [withCloudStorageRaw, withCloudStorage] = createHOCs(
  useCloudStorageRaw,
  useCloudStorage,
);

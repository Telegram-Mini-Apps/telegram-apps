import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';
import { Utils } from '@/components/Utils/Utils.js';

/**
 * @returns A new initialized instance of the `Utils` class.
 * @see Utils
 */
export const initUtils = createInitFn<Utils, 'version'>(
  ({ version, postEvent, createRequestId }) => {
    return new Utils(version, createRequestId, postEvent);
  },
);

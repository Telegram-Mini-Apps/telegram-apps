import { createInitFn } from '@/components/createInitFn.js';
import { Utils } from '@/components/utils/Utils.js';

/**
 * @returns A new initialized instance of Utils class.
 */
export const initUtils = createInitFn(
  ({ version, postEvent, createRequestId }) => {
    return new Utils(version, createRequestId, postEvent);
  },
);

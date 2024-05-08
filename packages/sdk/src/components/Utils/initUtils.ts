import { Utils } from '@/components/Utils/Utils.js';
import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

/**
 * @returns A new initialized instance of the `Utils` class.
 * @see Utils
 */
export const initUtils = createComponentInitFn<Utils, 'version'>(
  ({ version, postEvent, createRequestId }) => {
    return new Utils(version, createRequestId, postEvent);
  },
);

import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve init data raw representation.
 */
export const useInitDataRaw = createHook('initDataRaw');

/**
 * HOC to wrap specified component to pass init data raw representation.
 */
export const withInitDataRaw = createHoc('initDataRaw', useInitDataRaw);

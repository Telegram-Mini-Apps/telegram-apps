import { createHoc } from '../createHoc.js';
import { createHook } from '../createHook.js';

/**
 * Hook to retrieve CloudStorage component.
 */
export const useCloudStorage = createHook('cloudStorage');

/**
 * HOC to wrap specified component to pass CloudStorage instance.
 */
export const withCloudStorage = createHoc('cloudStorage', useCloudStorage);

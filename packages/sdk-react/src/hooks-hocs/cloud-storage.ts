import { initCloudStorage } from '@tma.js/sdk';

import { createHOC, type HOC } from '../createHOC.js';
import { createHook, type Hook } from '../createHook.js';

/**
 * Hook to receive the CloudStorage component instance.
 */
export const useCloudStorage: Hook<typeof initCloudStorage> = createHook(initCloudStorage);

/**
 * HOC to pass the CloudStorage component instance to the wrapped component.
 */
export const withCloudStorage: HOC<'cloudStorage', typeof useCloudStorage> = createHOC('cloudStorage', useCloudStorage);

import { createSignal } from '@/signals/utils.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';
import type { Version } from '@/version/types.js';

/**
 * Signal with a currently supported maximum Mini Apps version.
 */
export const version = createSignal<Version>('0.0');

/**
 * Signal with a currently used postEvent function across the package.
 */
export const postEvent = createSignal(defaultPostEvent);

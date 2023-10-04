import type { PostEvent as BridgePostEvent } from '@tma.js/bridge';

export type PostEvent = BridgePostEvent;

/**
 * Color scheme.
 */
export type ColorScheme = 'dark' | 'light';

/**
 * Function which generates unique request identifiers.
 */
export type CreateRequestIdFunc = () => string;

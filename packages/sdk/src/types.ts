import {Bridge} from '@twa.js/bridge';

/**
 * Minimal set of properties SDK requires from bridge.
 */
export type BridgeLike = Pick<Bridge, 'postEvent' | 'off' | 'on'>;

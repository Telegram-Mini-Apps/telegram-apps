import {Bridge} from '@twa.js/bridge';

/**
 * Minimal set of properties SDK requires from bridge.
 */
type BridgeLike = Pick<Bridge, 'postEvent' | 'off' | 'on'>;

export {BridgeLike};
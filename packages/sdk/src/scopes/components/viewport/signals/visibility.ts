import { signalFromState } from './state.js';

/**
 * Signal indicating if the app is currently visible or hidden.
 */
export const isVisible = signalFromState('isVisible');
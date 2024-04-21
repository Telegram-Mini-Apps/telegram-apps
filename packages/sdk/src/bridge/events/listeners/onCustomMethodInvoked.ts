import { createOn } from './createOn.js';
import { customMethodInvoked } from '../parsers/customMethodInvoked.js';

/**
 * Adds new event listener to the "custom_method_invoked" event.
 */
export const onCustomMethodInvoked = createOn('custom_method_invoked', customMethodInvoked);

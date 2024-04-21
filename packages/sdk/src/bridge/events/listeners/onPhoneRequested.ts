import { createOn } from './createOn.js';
import { phoneRequested } from '../parsers/phoneRequested.js';

/**
 * Adds new event listener to the "phone_requested" event.
 */
export const onPhoneRequested = createOn('phone_requested', phoneRequested);

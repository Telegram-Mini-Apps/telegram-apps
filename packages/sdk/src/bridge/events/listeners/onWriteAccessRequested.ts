import { createOn } from './createOn.js';
import { writeAccessRequested } from '../parsers/writeAccessRequested.js';

/**
 * Adds new event listener to the "write_access_requested" event.
 */
export const onWriteAccessRequested = createOn('write_access_requested', writeAccessRequested);

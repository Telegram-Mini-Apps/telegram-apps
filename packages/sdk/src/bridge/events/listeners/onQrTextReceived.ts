import { createOn } from './createOn.js';
import { qrTextReceived } from '../parsers/qrTextReceived.js';

/**
 * Adds new event listener to the "qr_text_received" event.
 */
export const onQrTextReceived = createOn('qr_text_received', qrTextReceived);

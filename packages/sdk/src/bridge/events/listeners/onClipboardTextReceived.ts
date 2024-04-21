import { createOn } from './createOn.js';
import { clipboardTextReceived } from '../parsers/clipboardTextReceived.js';

/**
 * Adds new event listener to the "clipboard_text_received" event.
 */
export const onClipboardTextReceived = createOn('clipboard_text_received', clipboardTextReceived);

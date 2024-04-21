import { createOn } from './createOn.js';
import { popupClosed } from '../parsers/popupClosed.js';

/**
 * Adds new event listener to the "popup_closed" event.
 */
export const onPopupClosed = createOn('popup_closed', popupClosed);

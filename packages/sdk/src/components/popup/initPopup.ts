import { createInitFn } from '@/components/createInitFn.js';
import { Popup } from '@/components/popup/Popup.js';

/**
 * @returns A new initialized instance of Popup class.
 */
export const initPopup = createInitFn('popup', (
  { postEvent, version },
  { isOpened = false },
) => new Popup(isOpened, version, postEvent));

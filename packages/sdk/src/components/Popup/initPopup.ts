import { createComponentInitFn } from '@/misc/createComponentInitFn/createComponentInitFn.js';

import { Popup } from './Popup.js';

/**
 * @returns A new initialized instance of the `Popup` class.
 * @see Popup
 */
export const initPopup = createComponentInitFn<Popup, 'version'>(
  ({ postEvent, version }) => new Popup(false, version, postEvent),
);

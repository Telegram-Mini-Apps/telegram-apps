import { createInitFn } from '@/components/utilities/createInitFn/createInitFn.js';

import { Popup } from './Popup.js';

/**
 * @returns A new initialized instance of the `Popup` class.
 * @see Popup
 */
export const initPopup = createInitFn<Popup, 'version'>(
  ({ postEvent, version }) => new Popup(false, version, postEvent),
);

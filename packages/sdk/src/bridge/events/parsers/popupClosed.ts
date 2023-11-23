import { json, string } from '~/parsing/index.js';

export interface PopupClosedPayload {
  /**
   * Identifier of the clicked button. In case, the popup was closed without clicking any button,
   * this property will be omitted.
   */
  button_id?: string;
}

export function popupClosed() {
  return json<PopupClosedPayload>({
    button_id: (value) => (
      value === null || value === undefined
        ? undefined
        : string().parse(value)
    ),
  });
}

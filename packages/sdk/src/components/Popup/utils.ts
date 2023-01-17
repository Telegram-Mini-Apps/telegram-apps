import {PopupButton, PopupParams as BridgePopupParams} from '@twa.js/bridge';

import {PopupParams} from './types';

/**
 * Prepares popup parameters before sending them to native app.
 * @param params - popup parameters.
 */
function preparePopupParams(params: PopupParams): BridgePopupParams {
  const message = params.message.trim();
  const title = (params.title || '').trim();
  const buttons = params.buttons || [];
  let preparedButtons: PopupButton[];

  // Check title.
  if (title.length > 64) {
    throw new Error(`Title has incorrect size: ${title.length}`);
  }

  // Check message.
  if (message.length === 0 || message.length > 256) {
    throw new Error(`Message has incorrect size: ${message.length}`);
  }

  // Check buttons.
  if (buttons.length > 3) {
    throw new Error(`Buttons have incorrect size: ${buttons.length}`);
  }

  // Append button in case, there are no buttons passed.
  if (buttons.length === 0) {
    preparedButtons = [{type: 'close', id: ''}];
  } else {
    // Otherwise, check all the buttons.
    preparedButtons = buttons.map(b => {
      const {id = ''} = b;

      // Check button ID.
      if (id.length > 64) {
        throw new Error(`Button ID has incorrect size: ${id}`);
      }

      switch (b.type) {
        case undefined:
        case 'default':
        case 'destructive':
          b.text = b.text.trim();

          if (b.text.length === 0 || b.text.length > 64) {
            const type = b.type || 'default';
            throw new Error(`Button text with type "${type}" has incorrect size: ${b.text.length}`);
          }
          break;
      }
      return {...b, id};
    });
  }
  return {title, message, buttons: preparedButtons};
}

export {preparePopupParams};
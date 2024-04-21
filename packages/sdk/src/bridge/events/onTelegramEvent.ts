import { onWindow } from '@/events/onWindow.js';
import type { RemoveEventListenerFn } from '@/types/index.js';

import { parseMessage } from '../parseMessage.js';

/**
 * Adds listener to window "message" event assuming, that this event could
 * be sent by Telegram native application. Calls passed callback with event
 * type and data.
 * @param cb - callback to call.
 */
export function onTelegramEvent(
  cb: (eventType: string, eventData: unknown) => void,
): RemoveEventListenerFn {

}

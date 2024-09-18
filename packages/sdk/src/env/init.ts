import { defineEventHandlers, isIframe } from '@telegram-apps/bridge';

import { initWeb } from './initWeb.js';

/**
 * Initializes special global handlers allowing the application to handle events in some Telegram
 * native applications.
 * @param acceptCustomStyles - should the application receive custom styles sent from the
 * native Telegram application.
 */
export function init(acceptCustomStyles = true): void {
  isIframe() && initWeb(acceptCustomStyles);
  defineEventHandlers();
}
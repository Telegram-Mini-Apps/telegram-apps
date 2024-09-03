import { defineEventHandlers, isIframe } from '@telegram-apps/bridge';

import { initWeb } from './initWeb.js';

/**
 * Initializes special global handlers allowing the application to handle events in some Telegram
 * native applications.
 */
export function init(): void {
  if (isIframe()) {
    initWeb();
  }
  defineEventHandlers();
}
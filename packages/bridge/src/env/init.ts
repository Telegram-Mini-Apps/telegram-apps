import { defineEventHandlers } from '@/bridge/events/handlers.js';
import { isIframe } from '@/env/isIframe.js';
import { initWeb } from '@/env/initWeb.js';

export function init() {
  if (isIframe()) {
    initWeb();
  }
  defineEventHandlers();
  // fixme
}
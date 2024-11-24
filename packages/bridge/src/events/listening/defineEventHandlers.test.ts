import { it, expect } from 'vitest';
import { mockWindow } from 'test-utils';

import { defineEventHandlers } from './defineEventHandlers.js';
import { emitMiniAppsEvent } from '@/events/emitMiniAppsEvent.js';

it('should should specify emitMiniAppsEvent function by paths [window.TelegramGameProxy_receiveEvent, window.TelegramGameProxy.receiveEvent, window.Telegram.WebView.receiveEvent]', () => {
  const wnd = {};
  mockWindow(wnd as any);
  defineEventHandlers();
  expect(wnd).toStrictEqual({
    TelegramGameProxy_receiveEvent: emitMiniAppsEvent,
    TelegramGameProxy: { receiveEvent: emitMiniAppsEvent },
    Telegram: { WebView: { receiveEvent: emitMiniAppsEvent } },
  });
});
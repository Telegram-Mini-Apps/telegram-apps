import { it, expect, vi, afterEach } from 'vitest';
import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';

import { defineEventHandlers } from './defineEventHandlers.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should should specify emitMiniAppsEvent function by paths [window.TelegramGameProxy_receiveEvent, window.TelegramGameProxy.receiveEvent, window.Telegram.WebView.receiveEvent]', () => {
  const wnd: Record<string, any> = {};
  vi
    .spyOn(window, 'window', 'get')
    .mockImplementation(() => wnd as any);

  defineEventHandlers();

  expect(wnd).toStrictEqual({
    TelegramGameProxy_receiveEvent: emitMiniAppsEvent,
    TelegramGameProxy: { receiveEvent: emitMiniAppsEvent },
    Telegram: { WebView: { receiveEvent: emitMiniAppsEvent } },
  });
});
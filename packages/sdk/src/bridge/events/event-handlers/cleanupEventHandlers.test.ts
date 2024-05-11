import { it, expect, vi, afterEach } from 'vitest';

import { cleanupEventHandlers } from './cleanupEventHandlers.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should delete window properties: TelegramGameProxy_receiveEvent, TelegramGameProxy, Telegram', () => {
  const wnd: Record<string, any> = {};
  vi
    .spyOn(window, 'window', 'get')
    .mockImplementation(() => ({
      TelegramGameProxy_receiveEvent: {},
      TelegramGameProxy: { receiveEvent: {} },
      Telegram: { WebView: { receiveEvent: {} } },
    } as any));

  cleanupEventHandlers();

  expect(wnd).toStrictEqual({});
});
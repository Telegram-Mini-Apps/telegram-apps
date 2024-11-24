import { expect, it } from 'vitest';
import { mockWindow } from 'test-utils';

import { removeEventHandlers } from './removeEventHandlers.js';

it('should delete window properties: TelegramGameProxy_receiveEvent, TelegramGameProxy, Telegram', () => {
  const wnd = {
    TelegramGameProxy_receiveEvent: {},
    TelegramGameProxy: { receiveEvent: {} },
    Telegram: { WebView: { receiveEvent: {} } },
  };
  mockWindow(wnd as any);
  removeEventHandlers();
  expect(wnd).toStrictEqual({});
});
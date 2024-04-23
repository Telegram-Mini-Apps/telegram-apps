import { afterEach, expect, it, vi } from 'vitest';

import { onTelegramEvent } from './onTelegramEvent.js';

import { createWindow } from '@test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should call passed callback with event type and data in case, window generated "message" event with data, presented as object with properties "eventType" (string) and "eventData" (unknown). Object is converted to string.', () => {
  createWindow({ env: 'iframe' });
  const callback = vi.fn();
  onTelegramEvent(callback);

  dispatchWindowMessageEvent('qr_text_received', {});

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('qr_text_received', {});
});

it('should not define event handlers twice in case, window object contains "TelegramGameProxy_receiveEvent" property.', () => {
  createWindow();
  (window as any).TelegramGameProxy_receiveEvent = true;

  onTelegramEvent(vi.fn());
  expect(window).not.toHaveProperty('Telegram');
});

it('should call passed callback with event type and data in case, external environment generated event.', () => {
  createWindow();
  const callback = vi.fn();
  onTelegramEvent(callback);

  (window as any).TelegramGameProxy_receiveEvent('test', false);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('test', false);
});

it('should ignore a message event with unexpected data', () => {
  createWindow();
  const callback = vi.fn();
  onTelegramEvent(callback);

  window.dispatchEvent(new MessageEvent('message', { data: null }));

  expect(callback).toHaveBeenCalledTimes(0);
});

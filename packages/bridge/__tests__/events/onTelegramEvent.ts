import { expect, test, vi, beforeEach, afterEach } from 'vitest';

import { onTelegramEvent } from '../../src/events/onTelegramEvent.js';
import { createWindow, type WindowSpy } from '../../__test-utils__/createWindow.js';
import { dispatchWindowMessageEvent } from '../../__test-utils__/dispatchWindowMessageEvent.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockReset();
});

test('events', () => {
  test('onTelegramEvent.ts', () => {
    test('onTelegramEvent', () => {
     test('should call passed callback with event type and data in case, window generated "message" event with data, presented as object with properties "eventType" (string) and "eventData" (unknown). Object is converted to string.', () => {
        const callback = vi.fn();
        onTelegramEvent(callback);

        dispatchWindowMessageEvent('qr_text_received', {});

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('qr_text_received', {});
      });

     test('should not define event handlers twice in case, window object contains "TelegramGameProxy_receiveEvent" property.', () => {
        (window as any).TelegramGameProxy_receiveEvent = true;

        onTelegramEvent(vi.fn());
        expect(window).not.toHaveProperty('Telegram');
      });

     test('should call passed callback with event type and data in case, external environment generated event.', () => {
        const callback = vi.fn();
        onTelegramEvent(callback);

        (window as any).TelegramGameProxy_receiveEvent('test', false);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('test', false);
      });
    });
  });
});

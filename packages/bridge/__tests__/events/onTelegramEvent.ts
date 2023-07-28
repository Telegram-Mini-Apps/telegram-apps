import { onTelegramEvent } from '../../src/events/onTelegramEvent.js';
import { dispatchWindowEvent, mockWindow } from '../__utils__/window.js';

mockWindow();

describe('events', () => {
  describe('onTelegramEvent.ts', () => {
    describe('onTelegramEvent', () => {
      it('should call passed callback with event type and data in case, window generated "message" event with data, presented as object with properties "eventType" (string) and "eventData" (unknown). Object is converted to string.', () => {
        const callback = jest.fn();
        onTelegramEvent(callback);

        dispatchWindowEvent('qr_text_received', {});

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('qr_text_received', {});
      });

      it('should not define event handlers twice in case, window object contains "TelegramGameProxy_receiveEvent" property.', () => {
        (window as any).TelegramGameProxy_receiveEvent = true;

        onTelegramEvent(jest.fn());
        expect(window).not.toHaveProperty('Telegram');
      });

      it('should call passed callback with event type and data in case, external environment generated event.', () => {
        const callback = jest.fn();
        onTelegramEvent(callback);

        (window as any).TelegramGameProxy_receiveEvent('test', false);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('test', false);
      });
    });
  });
});

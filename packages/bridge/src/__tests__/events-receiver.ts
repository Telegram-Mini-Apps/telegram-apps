import {expect, it, describe, jest, beforeEach, afterEach} from '@jest/globals';
import {defineEventsReceiver} from '../events-receiver';

describe('events-receiver', () => {
  describe('defineEventsReceiver', () => {
    let windowSpy = jest.spyOn(window, 'window', 'get');
    let dispatchSpy = jest.fn();
    let wnd: any;

    beforeEach(() => {
      wnd = {dispatchEvent: dispatchSpy};
      windowSpy.mockImplementation(() => wnd);
    });

    afterEach(() => {
      windowSpy.mockClear();
      dispatchSpy.mockClear();
    });

    const paths = [
      ['TelegramGameProxy_receiveEvent'],
      ['TelegramGameProxy', 'receiveEvent'],
      ['Telegram', 'WebView', 'receiveEvent'],
    ];

    paths.forEach(path => {
      const pathStr = path.join('.');

      it(`should assign handler by path "${pathStr}" which calls ` +
        'window.dispatchEvent with MessageEvent containing data ' +
        'property which is JSON object {eventType: string, eventData: unknown} ' +
        'converted to string', () => {
        defineEventsReceiver();

        // Path starts from "window" object.
        let pointer = window as any;

        path.forEach((item, idx, arr) => {
          // We are on the last iteration, where target function should be
          // specified.
          if (idx === arr.length - 1) {
            pointer = pointer[item];
            return;
          }

          if (!(item in pointer)) {
            pointer[item] = {};
          }
          pointer = pointer[item];
        });

        expect(typeof pointer).toBe('function');
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
        pointer('custom_event', 'custom_data');
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith(new MessageEvent('message', {
          data: JSON.stringify({
            eventType: 'custom_event',
            eventData: 'custom_data',
          }),
        }));
      });
    });
  });
});
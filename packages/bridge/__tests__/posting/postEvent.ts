import {describe, jest, beforeEach, afterEach, it, expect} from '@jest/globals';
import {postEvent} from '../../src/posting';

describe('posting', () => {
  describe('postEvent.ts', () => {
    describe('postEvent', () => {
      let windowSpy: ReturnType<typeof jest.spyOn>;

      beforeEach(() => {
        windowSpy = jest.spyOn(window, 'window', 'get');
      });

      afterEach(() => {
        windowSpy.mockRestore();
      });

      it('should call "window.parent.postMessage" with object ' +
        'with properties {eventType: string, eventData: any} converted to ' +
        'string in case, current environment is WebView', () => {
        const postMessageSpy = jest.fn();
        windowSpy.mockImplementation(() => ({
          self: 1000,
          top: 900,
          parent: {postMessage: postMessageSpy},
        }) as any);

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close');
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_close',
          eventData: undefined,
        }), 'https://web.telegram.org');

        postMessageSpy.mockClear();

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_set_header_color', {color_key: 'bg_color'});
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_set_header_color',
          eventData: {color_key: 'bg_color'},
        }), 'https://web.telegram.org');

        postMessageSpy.mockClear();

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close', {targetOrigin: 'abc'});
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_close',
          eventData: undefined,
        }), 'abc');

        postMessageSpy.mockClear();

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent(
          'web_app_set_header_color',
          {color_key: 'bg_color'},
          {targetOrigin: 'abc'},
        );
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_set_header_color',
          eventData: {color_key: 'bg_color'},
        }), 'abc');
      });

      it('should call "window.TelegramWebviewProxy.postEvent" with event name ' +
        'and parameters converted to string in case, passed value contains ' +
        '"TelegramWebviewProxy" property', () => {
        const postEventSpy = jest.fn();
        windowSpy.mockImplementation(() => ({
          TelegramWebviewProxy: {postEvent: postEventSpy},
        }) as any);

        expect(postEventSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close');
        expect(postEventSpy).toHaveBeenCalledTimes(1);
        expect(postEventSpy).toHaveBeenCalledWith('web_app_close', undefined);

        postEventSpy.mockClear();

        expect(postEventSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_set_header_color', {color_key: 'bg_color'});
        expect(postEventSpy).toHaveBeenCalledTimes(1);
        expect(postEventSpy).toHaveBeenCalledWith(
          'web_app_set_header_color', JSON.stringify({color_key: 'bg_color'}),
        );
      });

      it('should call "window.external.notify" with object ' +
        'with properties {eventType: string, eventData: any} converted to ' +
        'string in case, passed value contains "external.notify" path, where ' +
        '"notify" is function', () => {
        const notifySpy = jest.fn();
        windowSpy.mockImplementation(() => ({
          external: {notify: notifySpy},
        }) as any);

        expect(notifySpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close');
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_close',
          eventData: undefined,
        }));

        notifySpy.mockClear();

        expect(notifySpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_set_header_color', {color_key: 'bg_color'});
        expect(notifySpy).toHaveBeenCalledTimes(1);
        expect(notifySpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_set_header_color',
          eventData: {color_key: 'bg_color'},
        }));
      });

      it('should throw an error in case, current environment is unknown', () => {
        expect(() => postEvent('web_app_close'))
          .toThrow('Unable to determine current environment and possible way to send event');
      });
    });
  });
});
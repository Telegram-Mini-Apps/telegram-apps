import { describe, jest, beforeEach, afterEach, it, expect } from '@jest/globals';
import { postEvent } from '../../src';

let windowSpy: ReturnType<typeof jest.spyOn>;

beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe('posting', () => {
  describe('postEvent.ts', () => {
    describe('postEvent', () => {
      it('should call "window.parent.postMessage" with object '
        + 'with properties {eventType: string, eventData: any} converted to '
        + 'string in case, current environment is iframe', () => {
        const postMessageSpy = jest.fn();
        windowSpy.mockImplementation(() => ({
          self: 1000,
          top: 900,
          parent: { postMessage: postMessageSpy },
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
        postEvent('web_app_set_header_color', { color_key: 'bg_color' });
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_set_header_color',
          eventData: { color_key: 'bg_color' },
        }), 'https://web.telegram.org');

        postMessageSpy.mockClear();

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close', { targetOrigin: 'abc' });
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_close',
          eventData: undefined,
        }), 'abc');

        postMessageSpy.mockClear();

        expect(postMessageSpy).toHaveBeenCalledTimes(0);
        postEvent(
          'web_app_set_header_color',
          { color_key: 'bg_color' },
          { targetOrigin: 'abc' },
        );
        expect(postMessageSpy).toHaveBeenCalledTimes(1);
        expect(postMessageSpy).toHaveBeenCalledWith(JSON.stringify({
          eventType: 'web_app_set_header_color',
          eventData: { color_key: 'bg_color' },
        }), 'abc');
      });

      it('should call "window.external.invoke" in case it exists. '
        + 'Passed value is array, converted to string. This array should '
        + 'contain event name and data.', () => {
        const spy = jest.fn();
        windowSpy.mockImplementation(() => ({
          external: { invoke: spy },
        }) as any);

        // Without parameters.
        expect(spy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('["web_app_close",null]');

        spy.mockClear();

        // With parameters.
        expect(spy).toHaveBeenCalledTimes(0);
        postEvent('web_app_set_header_color', { color_key: 'bg_color' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('["web_app_set_header_color",{"color_key":"bg_color"}]');
      });

      it('should call "window.external.notify" in case it exists. '
        + 'Passed value is object, converted to string. This object should '
        + 'contain fields "eventType" and "eventData".', () => {
        const spy = jest.fn();
        windowSpy.mockImplementation(() => ({
          external: { notify: spy },
        }) as any);

        // Without parameters.
        expect(spy).toHaveBeenCalledTimes(0);
        postEvent('web_app_close');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('{"eventType":"web_app_close"}');

        spy.mockClear();

        // With parameters.
        expect(spy).toHaveBeenCalledTimes(0);
        postEvent('web_app_set_header_color', { color_key: 'bg_color' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('{"eventType":"web_app_set_header_color","eventData":{"color_key":"bg_color"}}');
      });

      it('should throw an error in case, current environment is unknown', () => {
        expect(() => postEvent('web_app_close'))
          .toThrow('Unable to determine current environment and possible way to send event');
      });
    });
  });
});

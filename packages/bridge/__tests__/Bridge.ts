import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {Bridge} from '../src/Bridge';
import * as postEventPackage from '../src/posting/postEvent';

const now = new Date('2022-11-04T10:10:00.300Z');
jest.useFakeTimers().setSystemTime(now);

const noop = () => {
};

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(noop);
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(noop);

const postEventSpy = jest.spyOn(postEventPackage, 'postEvent').mockImplementation(noop);

let windowSpy: ReturnType<typeof jest.spyOn>;
let wnd: any;

// Listeners.
let listeners: Record<string, ((...args: any) => any)[]> = {};

const dispatchEvent = jest.fn((event: string, ...args: any[]): void => {
  const cbs = listeners[event] || [];
  cbs.forEach(cb => cb(...args));
});

const addEventListener = jest.fn((event: string, cb: (...args: any) => any): void => {
  if (listeners[event] === undefined) {
    listeners[event] = [];
  }
  listeners[event].push(cb);
});

beforeEach(() => {
  listeners = {};
  wnd = {dispatchEvent, addEventListener};
  windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => wnd);
});

afterEach(() => {
  dispatchEvent.mockClear();
  addEventListener.mockClear();
  consoleLogSpy.mockClear();
  consoleErrorSpy.mockClear();
  postEventSpy.mockClear();
  windowSpy.mockRestore();
});

describe('Bridge.ts', () => {
  describe('Bridge', () => {
    describe('static init', () => {
      it('should return bridge instance which catches window ' +
        '"message" events and calls listeners in case, they are listening to ' +
        'event described by message event payload', () => {
        const bridge = Bridge.init();
        const spy = jest.fn();

        expect(spy).not.toBeCalled();
        bridge.on('main_button_pressed', spy);
        dispatchEvent('message', {data: {eventType: 'main_button_pressed'}});
        expect(spy).toBeCalledWith();

        spy.mockClear();

        bridge.off('main_button_pressed', spy);
        dispatchEvent('message', {data: {eventType: 'main_button_pressed'}});
        expect(spy).not.toBeCalled();
      });
    });

    describe('events handling', () => {
      it('should correctly handle "viewport_changed" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = {
          height: 120,
          width: 300,
          is_expanded: true,
          is_state_stable: false,
        };
        bridge.on('viewport_changed', spy);
        dispatchEvent('message', {
          data: {eventType: 'viewport_changed', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should correctly handle "theme_changed" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = {
          theme_params: {
            bg_color: '#aabbdd',
            text_color: '#113322',
            hint_color: '#132245',
            link_color: '#133322',
            button_color: '#a23135',
            button_text_color: '#aa213f',
          },
        };
        bridge.on('theme_changed', spy);
        dispatchEvent('message', {
          data: {eventType: 'theme_changed', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should correctly handle "popup_closed" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        bridge.on('popup_closed', spy);
        [
          [{button_id: 'ok'}, {button_id: 'ok'}],
          [{button_id: null}, {}],
          [{button_id: undefined}, {}],
          [null, {}],
          [undefined, {}],
        ].forEach(([data, expected]) => {
          dispatchEvent('message', {
            data: {eventType: 'popup_closed', eventData: data},
          });
          expect(spy).toBeCalledWith(expected);
          spy.mockClear();
        });
      });

      it('should correctly handle "set_custom_style" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = 'div {}';
        bridge.on('set_custom_style', spy);
        dispatchEvent('message', {
          data: {eventType: 'set_custom_style', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should correctly handle "qr_text_received" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = {data: 'some QR data'};
        bridge.on('qr_text_received', spy);
        dispatchEvent('message', {
          data: {eventType: 'qr_text_received', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      ([
        'main_button_pressed', 'back_button_pressed', 'settings_button_pressed',
        'scan_qr_popup_closed',
      ] as const).forEach(eventType => {
        it(`should correctly handle "${eventType}" data`, () => {
          const spy = jest.fn();
          const bridge = Bridge.init();
          bridge.on(eventType, spy);
          dispatchEvent('message', {data: {eventType}});
          expect(spy).toBeCalledWith();
        });
      });

      it('should correctly handle "clipboard_text_received" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = {req_id: 'request id', data: 'clipboard value'};
        bridge.on('clipboard_text_received', spy);
        dispatchEvent('message', {
          data: {eventType: 'clipboard_text_received', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should correctly handle "invoice_closed" data', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = {slug: '&&*Sh1j213kx', status: 'PAID'};
        bridge.on('invoice_closed', spy);
        dispatchEvent('message', {
          data: {eventType: 'invoice_closed', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should correctly handle unknown event', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();
        const data = 'custom data here';
        bridge.on('custom_event' as any, spy);
        dispatchEvent('message', {
          data: {eventType: 'custom_event', eventData: data},
        });
        expect(spy).toBeCalledWith(data);
      });

      it('should not emit event in case, it contains incorrect payload', () => {
        const spy = jest.fn();
        const bridge = Bridge.init();

        bridge.on('viewport_changed', spy);
        dispatchEvent('message', {
          data: JSON.stringify({eventType: 'viewport_changed'}),
        });
        expect(spy).not.toBeCalled();
      });

      it('should log message into console if event process started', () => {
        Bridge.init({debug: true});

        expect(consoleLogSpy).not.toBeCalled();
        dispatchEvent('message', {
          data: JSON.stringify({eventType: 'viewport_changed'}),
        });
        expect(consoleLogSpy).toBeCalledWith(
          '[10:10:00.300]', '[Bridge]', 'Received event from Telegram:',
          'viewport_changed', undefined,
        );
      });

      it('should log error message into console if debug mode is ' +
        'enabled and event with incorrect payload was received', () => {
        Bridge.init({debug: true});

        expect(consoleErrorSpy).not.toBeCalled();
        dispatchEvent('message', {
          data: JSON.stringify({eventType: 'viewport_changed'}),
        });
        expect(consoleErrorSpy).toBeCalledWith(
          '[10:10:00.300]', '[Bridge]', 'Error processing Telegram event:',
          new TypeError('Value is not JSON object.'),
        );
      });
    });

    describe('postEvent', () => {
      it('should call package postEvent function with event ' +
        'name and options in case, event does not require parameters', () => {
        const bridge = Bridge.init({targetOrigin: 'custom origin'});

        expect(postEventSpy).not.toBeCalled();
        bridge.postEvent('web_app_close');
        expect(postEventSpy).toBeCalledWith(
          'web_app_close', {targetOrigin: 'custom origin'},
        );
      });

      it('should call package postEvent function with event ' +
        'name, parameters and options in case, event requires parameters', () => {
        const bridge = Bridge.init({targetOrigin: 'custom origin 2'});

        expect(postEventSpy).not.toBeCalled();
        bridge.postEvent('web_app_set_background_color', {
          color: '#ffaacc',
        });
        expect(postEventSpy).toBeCalledWith(
          'web_app_set_background_color',
          {color: '#ffaacc'},
          {targetOrigin: 'custom origin 2'},
        );
      });

      it('should display log message when called', () => {
        const bridge = Bridge.init({debug: true});

        expect(consoleLogSpy).not.toBeCalled();
        bridge.postEvent('web_app_close');
        expect(consoleLogSpy).toBeCalledWith(
          '[10:10:00.300]', '[Bridge]', 'Sending event to Telegram:',
          'web_app_close', undefined,
        );
      });
    });
  });
});
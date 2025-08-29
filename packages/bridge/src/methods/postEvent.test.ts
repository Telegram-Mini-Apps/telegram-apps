import {
  afterEach,
  expect,
  describe,
  it,
  vi,
} from 'vitest';
import { createWindow } from 'test-utils';

import { targetOrigin } from './targetOrigin.js';
import { postEvent } from './postEvent.js';
import { UnknownEnvError } from '@/errors.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('env: iframe', () => {
  it('should call "window.parent.postMessage" with object {eventType: string, eventData: any} converted to string', () => {
    const postMessage = vi.fn();
    createWindow({
      env: 'iframe',
      parent: { postMessage } as any,
    });

    postEvent('web_app_close');
    expect(postMessage).toHaveBeenCalledOnce();
    expect(postMessage).toHaveBeenCalledWith('{"eventType":"web_app_close"}', 'https://web.telegram.org');

    postMessage.mockClear();

    postEvent('web_app_set_header_color', { color_key: 'bg_color' });
    expect(postMessage).toHaveBeenCalledOnce();
    expect(postMessage).toHaveBeenCalledWith(
      '{"eventType":"web_app_set_header_color","eventData":{"color_key":"bg_color"}}',
      'https://web.telegram.org',
    );

    postMessage.mockClear();

    expect(postMessage).toHaveBeenCalledTimes(0);
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });
    expect(postMessage).toHaveBeenCalledOnce();
    expect(postMessage).toHaveBeenCalledWith(
      '{"eventType":"web_app_set_header_color","eventData":{"color_key":"bg_color"}}',
      'https://web.telegram.org',
    );
  });
});

describe('env: common mobile', () => {
  it('should call "window.TelegramWebviewProxy.postEvent" with the event name (string) as the first argument and event data (object converted to string) as the second one', () => {
    const spy = vi.fn();
    createWindow({
      TelegramWebviewProxy: {
        postEvent: spy,
      },
    } as any);

    // Without parameters.
    expect(spy).toHaveBeenCalledTimes(0);
    postEvent('web_app_close');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_close', undefined);

    spy.mockClear();

    // With parameters.
    expect(spy).toHaveBeenCalledTimes(0);
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_set_header_color', '{"color_key":"bg_color"}');
  });
});

describe('env: window mobile', () => {
  it('should call "window.external.notify" with object {eventType: string, eventData: any} converted to string', () => {
    const spy = vi.fn();
    createWindow({
      external: {
        notify: spy,
      },
    } as any);

    // Without parameters.
    postEvent('web_app_close');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('{"eventType":"web_app_close"}');

    spy.mockClear();

    // With parameters.
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('{"eventType":"web_app_set_header_color","eventData":{"color_key":"bg_color"}}');
  });
});

describe('env: unknown', () => {
  it('should throw', () => {
    createWindow();
    expect(() => postEvent('web_app_close')).toThrow(new UnknownEnvError());
  });
});

describe('target origin', () => {
  afterEach(() => {
    targetOrigin.reset();
  });

  it('should use globally set target origin', () => {
    const postMessage = vi.fn();
    createWindow({
      env: 'iframe',
      parent: { postMessage } as any,
    });

    targetOrigin.set('here we go!');
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });

    expect(postMessage).toHaveBeenCalledOnce();
    expect(postMessage).toHaveBeenCalledWith(
      '{"eventType":"web_app_set_header_color","eventData":{"color_key":"bg_color"}}',
      'here we go!',
    );
  });
});

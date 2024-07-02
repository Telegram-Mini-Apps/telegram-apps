import { createWindow } from '@test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import type { SpyInstance } from 'vitest';

import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
import { createTimeoutError } from '@/timeout/createTimeoutError.js';

import { type PostEvent, postEvent as globalPostEvent } from './methods/postEvent.js';
import { request } from './request.js';

vi.mock('../methods/postEvent', async () => {
  const { postEvent: actualPostEvent } = await vi
    .importActual('../methods/postEvent') as { postEvent: PostEvent };

  return {
    postEvent: vi.fn(actualPostEvent),
  };
});

let windowSpy: SpyInstance<[], Window & typeof globalThis>;

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  windowSpy = createWindow({ env: 'iframe' });
});

afterEach(() => {
  windowSpy.mockRestore();
  // Reset mini apps event emitter singleton.
  resetMiniAppsEventEmitter();
});

describe('options', () => {
  describe('timeout', () => {
    it('should throw an error in case, timeout was reached', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 1000,
      });

      vi.advanceTimersByTime(1500);

      return promise.catch(() => null).finally(() => {
        expect(promise).rejects.toEqual(createTimeoutError(1000));
      });
    });

    it('should not throw an error in case, data was received before timeout', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 1000,
      });

      vi.advanceTimersByTime(500);
      dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        expect(promise).resolves.toStrictEqual({ status: 'allowed' });
      });
    });
  });

  describe('postEvent', () => {
    it('should use specified postEvent property', () => {
      const postEvent = vi.fn();
      request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        postEvent,
      });
      expect(postEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
    });

    it('should use global postEvent function if according property was not specified', () => {
      request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
      });
      expect(globalPostEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
    });

    it('should reject promise in case, postEvent threw an error', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        postEvent() {
          throw new Error('Nope!');
        },
      });
      expect(promise).rejects.toStrictEqual(Error('Nope!'));
    });
  });

  describe('capture', () => {
    it('should capture an event in case, capture method returned true', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 1000,
        capture: ({ status }) => status === 'allowed',
      });

      vi.advanceTimersByTime(500);
      dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        expect(promise).resolves.toStrictEqual({ status: 'allowed' });
      });
    });

    it('should not capture an event in case, capture method returned false', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 500,
        capture: ({ status }) => status === 'allowed',
      });

      dispatchWindowMessageEvent('phone_requested', { status: 'declined' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        expect(promise).rejects.toMatchObject(createTimeoutError(500));
      });
    });
  });
});

describe('with request id', () => {
  it('should ignore event with the different request id', () => {
    const promise = request({
      method: 'web_app_read_text_from_clipboard',
      event: 'clipboard_text_received',
      timeout: 1000,
      params: { req_id: 'a' },
      capture: (({ req_id }) => req_id === 'a'),
    });

    dispatchWindowMessageEvent('clipboard_text_received', { req_id: 'b' });
    vi.advanceTimersByTime(1500);

    return promise.catch(() => null).finally(() => {
      expect(promise).rejects.toMatchObject(createTimeoutError(1000));
    });
  });

  it('should capture event with the same request id', () => {
    const promise = request({
      method: 'web_app_read_text_from_clipboard',
      event: 'clipboard_text_received',
      timeout: 1000,
      params: { req_id: 'a' },
      capture: (({ req_id }) => req_id === 'a'),
    });

    dispatchWindowMessageEvent('clipboard_text_received', {
      req_id: 'a',
      data: 'from clipboard',
    });
    vi.advanceTimersByTime(1500);

    return promise.catch(() => null).finally(() => {
      expect(promise).resolves.toStrictEqual({
        req_id: 'a',
        data: 'from clipboard',
      });
    });
  });
});

describe('multiple events', () => {
  describe('no params', () => {
    it('should handle any of the specified events', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: ['phone_requested', 'write_access_requested'],
        timeout: 1000,
      });

      dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1500);

      return promise
        .catch(() => null)
        .finally(() => {
          expect(promise).resolves.toStrictEqual({ status: 'allowed' });
        });
    });
  });

  describe('with params', () => {
    it('should handle any of the specified events', () => {
      const promise = request({
        method: 'web_app_data_send',
        event: ['phone_requested', 'write_access_requested'],
        timeout: 1000,
        params: { data: 'abc' },
      });

      dispatchWindowMessageEvent('write_access_requested', { status: 'declined' });
      vi.advanceTimersByTime(1500);

      return promise
        .catch(() => null)
        .finally(() => {
          expect(promise).resolves.toStrictEqual({ status: 'declined' });
        });
    });
  });
});

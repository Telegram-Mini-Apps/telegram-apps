import { dispatchMiniAppsEvent, createWindow } from 'test-utils';
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

import { resetMiniAppsEventEmitter } from '@/events/event-emitter/singleton.js';
import { createTimeoutError } from '@/timeout/createTimeoutError.js';
import { postEvent as globalPostEvent } from '@/methods/postEvent.js';
import { request } from './request.js';

vi.mock('@/methods/postEvent.js', async () => {
  const { postEvent: actualPostEvent } = await vi.importActual('@/methods/postEvent.js');
  return {
    postEvent: vi.fn(actualPostEvent as any),
  };
});

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  createWindow({ env: 'iframe' });
});

afterEach(() => {
  vi.restoreAllMocks();
  resetMiniAppsEventEmitter();
});

describe('options', () => {
  describe('timeout', () => {
    it('should throw if timeout was reached', async () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 1000,
      });

      vi.advanceTimersByTime(1500);

      await expect(promise).rejects.toThrow('Timeout reached: 1000ms');
    });

    it('should not throw an error in case, data was received before timeout', async () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 1000,
      });

      vi.advanceTimersByTime(500);
      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1000);

      await expect(promise).resolves.toStrictEqual({ status: 'allowed' });
    });
  });

  describe('postEvent', () => {
    it('should use specified postEvent property', () => {
      const postEvent = vi.fn();
      void request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        postEvent,
      });
      expect(postEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
    });

    it('should use global postEvent function if according property was not specified', () => {
      void request({
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
      void expect(promise).rejects.toStrictEqual(Error('Nope!'));
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
      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        void expect(promise).resolves.toStrictEqual({ status: 'allowed' });
      });
    });

    it('should not capture an event in case, capture method returned false', () => {
      const promise = request({
        method: 'web_app_request_phone',
        event: 'phone_requested',
        timeout: 500,
        capture: ({ status }) => status === 'allowed',
      });

      dispatchMiniAppsEvent('phone_requested', { status: 'declined' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        void expect(promise).rejects.toMatchObject(createTimeoutError(500));
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

    dispatchMiniAppsEvent('clipboard_text_received', { req_id: 'b' });
    vi.advanceTimersByTime(1500);

    return promise.catch(() => null).finally(() => {
      void expect(promise).rejects.toMatchObject(createTimeoutError(1000));
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

    dispatchMiniAppsEvent('clipboard_text_received', {
      req_id: 'a',
      data: 'from clipboard',
    });
    vi.advanceTimersByTime(1500);

    return promise.catch(() => null).finally(() => {
      void expect(promise).resolves.toStrictEqual({
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

      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1500);

      return promise
        .catch(() => null)
        .finally(() => {
          void expect(promise).resolves.toStrictEqual({ status: 'allowed' });
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

      dispatchMiniAppsEvent('write_access_requested', { status: 'declined' });
      vi.advanceTimersByTime(1500);

      return promise
        .catch(() => null)
        .finally(() => {
          void expect(promise).resolves.toStrictEqual({ status: 'declined' });
        });
    });
  });
});

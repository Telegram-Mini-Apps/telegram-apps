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
import { TypedError } from '@telegram-apps/toolkit';

import { resetPackageState } from '@/resetPackageState.js';
import { postEvent as globalPostEvent } from '@/methods/postEvent.js';
import { request } from './request.js';

vi.mock('@/methods/postEvent.js', async () => {
  const { postEvent: actualPostEvent } = await vi.importActual('@/methods/postEvent.js');
  return {
    postEvent: vi.fn(actualPostEvent as any),
  };
});

beforeEach(() => {
  createWindow({ env: 'iframe' });
});

afterEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
});

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});

describe('options', () => {
  describe('timeout', () => {
    it('should throw if timeout was reached', async () => {
      const p = request('web_app_request_phone', 'phone_requested', {
        timeout: 5,
      });

      vi.advanceTimersByTime(100);

      await expect(p).rejects.toMatchObject({
        type: 'ERR_TIMED_OUT',
        message: 'Timeout reached: 5ms',
      });
    });

    it('should not throw if data was received before timeout', async () => {
      const promise = request('web_app_request_phone', 'phone_requested', {
        timeout: 1000,
      });

      vi.advanceTimersByTime(500);
      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      vi.advanceTimersByTime(1000);

      await expect(promise).resolves.toStrictEqual({ status: 'allowed' });
    });
  });

  describe('postEvent', () => {
    it('should use specified postEvent property', async () => {
      const postEvent = vi.fn();
      const promise = request('web_app_request_phone', 'phone_requested', { postEvent });
      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      await promise;

      expect(postEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
    });

    it('should use global postEvent function if according property was not specified', async () => {
      const promise = request('web_app_request_phone', 'phone_requested');
      dispatchMiniAppsEvent('phone_requested', { status: 'allowed' });
      await promise;

      expect(globalPostEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
    });

    it('should reject promise if postEvent threw an error', () => {
      const promise = request('web_app_request_phone', 'phone_requested', {
        postEvent() {
          throw new Error('Nope!');
        },
      });
      void expect(promise).rejects.toStrictEqual(new Error('Nope!'));
    });
  });

  describe('capture', () => {
    it('should capture an event in case, capture method returned true', () => {
      const promise = request('web_app_request_phone', 'phone_requested', {
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
      const promise = request('web_app_request_phone', 'phone_requested', {
        timeout: 500,
        capture: ({ status }) => status === 'allowed',
      });

      dispatchMiniAppsEvent('phone_requested', { status: 'declined' });
      vi.advanceTimersByTime(1000);

      return promise.catch(() => null).finally(() => {
        void expect(promise).rejects.toMatchObject({ type: 'ERR_TIMED_OUT' });
      });
    });
  });

  describe('abortSignal', () => {
    it('should abort operation if abort was called', async () => {
      const controller = new AbortController();
      const p = request('web_app_request_phone', 'phone_requested', {
        abortSignal: controller.signal,
      });
      controller.abort(new Error('ABORTED'));
      await expect(p).rejects.toStrictEqual(new TypedError('ERR_ABORTED', {
        cause: new Error('ABORTED'),
      }));
    });
  });
});

describe('with request id', () => {
  it('should ignore event with different request id', async () => {
    const promise = request('web_app_read_text_from_clipboard', 'clipboard_text_received', {
      timeout: 1000,
      params: { req_id: 'a' },
      capture: (({ req_id }) => req_id === 'a'),
    });

    dispatchMiniAppsEvent('clipboard_text_received', { req_id: 'b' });
    vi.advanceTimersByTime(1500);

    await expect(promise).rejects.toMatchObject({ type: 'ERR_TIMED_OUT' });
  });

  it('should capture event with the same request id', async () => {
    const promise = request(
      'web_app_read_text_from_clipboard',
      'clipboard_text_received',
      {
        timeout: 1000,
        params: { req_id: 'a' },
        capture: (({ req_id }) => req_id === 'a'),
      },
    );

    dispatchMiniAppsEvent('clipboard_text_received', {
      req_id: 'a',
      data: 'from clipboard',
    });
    vi.advanceTimersByTime(1500);

    await expect(promise).resolves.toStrictEqual({
      req_id: 'a',
      data: 'from clipboard',
    });
  });
});

describe('multiple events', () => {
  describe('no params', () => {
    it('should handle any of the specified events', () => {
      const promise = request(
        'web_app_request_phone',
        ['phone_requested', 'write_access_requested'],
        { timeout: 1000 },
      );

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
      const promise = request(
        'web_app_data_send',
        ['phone_requested', 'write_access_requested'],
        {
          timeout: 1000,
          params: { data: 'abc' },
        },
      );

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

/* eslint-disable */
import { expect, test, vi, SpyInstance, beforeEach, afterEach } from 'vitest';

import { createWindow } from '../__test-utils__/createWindow.js';
import { request } from '../src/index.js';
import { postEvent as globalPostEvent } from '../src/methods/postEvent.js';
import { dispatchWindowMessageEvent } from '../__test-utils__/dispatchWindowMessageEvent.js';

let windowSpy: SpyInstance<[], Window & typeof globalThis>;

beforeEach(() => {
  windowSpy = createWindow({ env: 'iframe' });
  vi.useFakeTimers();
});

afterEach(() => {
  windowSpy.mockReset();
});

function emptyCatch() {

}

test('request.ts', () => {
  test('request', () => {
    test('options', () => {
      test('timeout', () => {
       test('should throw an error in case, timeout was reached', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
          });

          vi.advanceTimersByTime(1500);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 1000'));
          });
        });

       test('should not throw an error in case, data was received before timeout', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
          });

          vi.advanceTimersByTime(500);
          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          vi.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).resolves.toStrictEqual({ status: 'allowed' });
          });
        });
      });

      test('postEvent', () => {
       test('should use specified postEvent property', () => {
          const postEvent = vi.fn();
          request('web_app_request_phone', 'phone_requested', { postEvent });
          expect(postEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
        });

       test('should use global postEvent function if according property was not specified', () => {
          request('web_app_request_phone', 'phone_requested');
          expect(globalPostEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
        });

       test('should reject promise in case, postEvent threw an error', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            postEvent: () => {
              throw new Error('Nope!');
            },
          });
          expect(promise).rejects.toStrictEqual(Error('Nope!'));
        });
      });

      test('capture', () => {
       test('should capture an event in case, capture method returned true', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
            capture: ({ status }) => status === 'allowed',
          });

          vi.advanceTimersByTime(500);
          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          vi.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).resolves.toStrictEqual({ status: 'allowed' });
          });
        });

       test('should not capture an event in case, capture method returned false', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 500,
            capture: ({ status }) => status === 'allowed',
          });

          dispatchWindowMessageEvent('phone_requested', { status: 'declined' });
          vi.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 500'));
          });
        });
      });
    });

    test('with request id', () => {
     test('should ignore event with the different request id', () => {
        const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received', {
          timeout: 1000,
        });

        dispatchWindowMessageEvent('clipboard_text_received', { req_id: 'b' });
        vi.advanceTimersByTime(1500);

        return promise.catch(emptyCatch).finally(() => {
          expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 1000'));
        });
      });

     test('should capture event with the same request id', () => {
        const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received', {
          timeout: 1000,
        });

        dispatchWindowMessageEvent('clipboard_text_received', {
          req_id: 'a',
          data: 'from clipboard',
        });
        vi.advanceTimersByTime(1500);

        return promise.catch(emptyCatch).finally(() => {
          expect(promise).resolves.toStrictEqual({
            req_id: 'a',
            data: 'from clipboard',
          });
        });
      });
    });

    test('multiple events', () => {
      test('no params', () => {
       test('should handle any of the specified events', () => {
          const promise = request(
            'web_app_request_phone',
            ['phone_requested', 'write_access_requested'],
            { timeout: 1000 },
          );
          const promise2 = request(
            'web_app_request_phone',
            ['phone_requested', 'write_access_requested'],
            { timeout: 1000 },
          );

          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          dispatchWindowMessageEvent('write_access_requested', { status: 'declined' });
          vi.advanceTimersByTime(1500);

          return Promise
            .all([promise, promise2])
            .catch(emptyCatch)
            .finally(() => {
              expect(promise).resolves.toStrictEqual({ status: 'allowed' });
              expect(promise2).resolves.toStrictEqual({ status: 'declined' });
            });
        });
      });

      test('with params', () => {
       test('should handle any of the specified events', () => {
          const promise = request(
            'web_app_data_send',
            { data: 'abc' },
            ['phone_requested', 'write_access_requested'],
            { timeout: 1000 },
          );
          const promise2 = request(
            'web_app_data_send',
            { data: 'abc' },
            ['phone_requested', 'write_access_requested'],
            { timeout: 1000 },
          );

          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          dispatchWindowMessageEvent('write_access_requested', { status: 'declined' });
          vi.advanceTimersByTime(1500);

          return Promise
            .all([promise, promise2])
            .catch(emptyCatch)
            .finally(() => {
              expect(promise).resolves.toStrictEqual({ status: 'allowed' });
              expect(promise2).resolves.toStrictEqual({ status: 'declined' });
            });
        });
      });
    });

    // test('no params methods', () => {
    //  test('should properly handle ')
    // });

    // test('with request id', () => {
    //   const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received');
    //
    //   dispatchWindowEvent('clipboard_text_received', { req_id: 'b' });
    //   expect(promise).resolves.toHaveLength(0);
    //   dispatchWindowEvent('clipboard_text_received', { req_id: 'a' });
    //   expect(promise).resolves.toHaveLength(1);
    // });
  });
});

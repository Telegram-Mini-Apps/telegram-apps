/* eslint-disable */
import { createWindow } from './__utils__/createWindow.js';
import { request } from '../src/index.js';
import { postEvent as globalPostEvent } from '../src/methods/postEvent.js';
import { dispatchWindowMessageEvent } from './__utils__/dispatchWindowMessageEvent.js';

let windowSpy: jest.SpyInstance<Window & typeof globalThis>;

beforeEach(() => {
  windowSpy = createWindow({ env: 'iframe' });
  jest.useFakeTimers();
});

afterEach(() => {
  windowSpy.mockReset();
});

jest.mock('../src/methods/postEvent.js', () => {
  const { postEvent: actualPostEvent, ...rest } = jest.requireActual('../src/methods/postEvent.js');

  return {
    __esModule: true,
    ...rest,
    postEvent: jest.fn(actualPostEvent),
  };
});

function emptyCatch() {

}

describe('request.ts', () => {
  describe('request', () => {
    describe('options', () => {
      describe('timeout', () => {
        it('should throw an error in case, timeout was reached', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
          });

          jest.advanceTimersByTime(1500);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 1000'));
          });
        });

        it('should not throw an error in case, data was received before timeout', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
          });

          jest.advanceTimersByTime(500);
          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          jest.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).resolves.toStrictEqual({ status: 'allowed' });
          });
        });
      });

      describe('postEvent', () => {
        it('should use specified postEvent property', () => {
          const postEvent = jest.fn();
          request('web_app_request_phone', 'phone_requested', { postEvent });
          expect(postEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
        });

        it('should use global postEvent function if according property was not specified', () => {
          request('web_app_request_phone', 'phone_requested');
          expect(globalPostEvent).toHaveBeenCalledWith('web_app_request_phone', undefined);
        });

        it('should reject promise in case, postEvent threw an error', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            postEvent: () => {
              throw new Error('Nope!');
            },
          });
          expect(promise).rejects.toStrictEqual(Error('Nope!'));
        });
      });

      describe('capture', () => {
        it('should capture an event in case, capture method returned true', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 1000,
            capture: ({ status }) => status === 'allowed',
          });

          jest.advanceTimersByTime(500);
          dispatchWindowMessageEvent('phone_requested', { status: 'allowed' });
          jest.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).resolves.toStrictEqual({ status: 'allowed' });
          });
        });

        it('should not capture an event in case, capture method returned false', () => {
          const promise = request('web_app_request_phone', 'phone_requested', {
            timeout: 500,
            capture: ({ status }) => status === 'allowed',
          });

          dispatchWindowMessageEvent('phone_requested', { status: 'declined' });
          jest.advanceTimersByTime(1000);

          return promise.catch(emptyCatch).finally(() => {
            expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 500'));
          });
        });
      });
    });

    describe('with request id', () => {
      it('should ignore event with the different request id', () => {
        const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received', {
          timeout: 1000,
        });

        dispatchWindowMessageEvent('clipboard_text_received', { req_id: 'b' });
        jest.advanceTimersByTime(1500);

        return promise.catch(emptyCatch).finally(() => {
          expect(promise).rejects.toEqual(new Error('Async call timeout exceeded. Timeout: 1000'));
        });
      });

      it('should capture event with the same request id', () => {
        const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received', {
          timeout: 1000,
        });

        dispatchWindowMessageEvent('clipboard_text_received', {
          req_id: 'a',
          data: 'from clipboard',
        });
        jest.advanceTimersByTime(1500);

        return promise.catch(emptyCatch).finally(() => {
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
          jest.advanceTimersByTime(1500);

          return Promise
            .all([promise, promise2])
            .catch(emptyCatch)
            .finally(() => {
              expect(promise).resolves.toStrictEqual({ status: 'allowed' });
              expect(promise2).resolves.toStrictEqual({ status: 'declined' });
            });
        });
      });

      describe('with params', () => {
        it('should handle any of the specified events', () => {
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
          jest.advanceTimersByTime(1500);

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

    // describe('no params methods', () => {
    //   it('should properly handle ')
    // });

    // describe('with request id', () => {
    //   const promise = request('web_app_read_text_from_clipboard', { req_id: 'a' }, 'clipboard_text_received');
    //
    //   dispatchWindowEvent('clipboard_text_received', { req_id: 'b' });
    //   expect(promise).resolves.toHaveLength(0);
    //   dispatchWindowEvent('clipboard_text_received', { req_id: 'a' });
    //   expect(promise).resolves.toHaveLength(1);
    // });
  });
});

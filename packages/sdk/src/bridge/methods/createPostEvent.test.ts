import { afterEach, expect, it, vi } from 'vitest';

import type { FnToSpy } from '@test-utils/types.js';

import { createPostEvent } from './createPostEvent.js';
import { postEvent as postEventFn } from './postEvent.js';

const postEvent = postEventFn as unknown as FnToSpy<typeof postEventFn>;

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock('./postEvent', () => ({ postEvent: vi.fn() }));

it('should throw if passed method is unsupported in specified version', () => {
  expect(() => createPostEvent('6.0')('web_app_request_write_access')).toThrow(
    'Method "web_app_request_write_access" is unsupported in Mini Apps version 6.0',
  );
});

it('should throw "web_app_set_header_color.color" parameter is unsupported', () => {
  expect(() => createPostEvent('6.3')('web_app_set_header_color', { color: '#aaaaaa' }))
    .toThrow('Parameter "color" of "web_app_set_header_color" method is unsupported in Mini Apps version 6.3');
});

it('should call global postEvent function', () => {
  createPostEvent('6.3')('web_app_request_viewport');
  expect(postEvent).toHaveBeenCalledOnce();
  expect(postEvent).toHaveBeenCalledWith('web_app_request_viewport', undefined);
});

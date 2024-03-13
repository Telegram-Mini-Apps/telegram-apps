import { expect, it, vi } from 'vitest';

import { createPostEvent } from '../createPostEvent';
import * as postEventModule from '../postEvent';

vi.mock('../postEvent', () => ({
  postEvent: vi.fn(),
}));

it('should throw error if passed method is unsupported in specified version', () => {
  const postEvent = createPostEvent('6.0');
  expect(() => postEvent('web_app_request_write_access'))
    .toThrow('Method "web_app_request_write_access" is unsupported in the Mini Apps version 6.0.');
});

it('should throw error if passed method parameter is unsupported in specified version', () => {
  const postEvent = createPostEvent('6.3');
  expect(() => postEvent('web_app_open_link', {
    url: '',
    try_instant_view: true,
  }))
    .toThrow('Parameter "try_instant_view" in method "web_app_open_link" is unsupported in the Mini Apps version 6.3.');

  expect(() => postEvent('web_app_set_header_color', {
    color: '#aaaaaa',
  }))
    .toThrow('Parameter "color" in method "web_app_set_header_color" is unsupported in the Mini Apps version 6.3.');
});

it('should call global postEvent function', () => {
  const postEvent = createPostEvent('6.3');
  const spy = vi.spyOn(postEventModule, 'postEvent');

  postEvent('web_app_request_viewport');
  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith('web_app_request_viewport', undefined);
});

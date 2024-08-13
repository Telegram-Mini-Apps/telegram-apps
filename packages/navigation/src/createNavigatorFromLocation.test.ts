import { expect, describe, vi, afterEach, it, beforeEach } from 'vitest';

import { createNavigatorFromLocation } from './createNavigatorFromLocation.js';

describe.each([
  [
    'standard launch',
    'https://example.com/#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
  ],
  [
    'launch with pathname specified',
    'https://example.com/pathname#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
  ],
  [
    'launch with pathname and search specified',
    'https://example.com/pathname?a=1#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
  ],
  [
    'launch with pathname, search and hash specified',
    'https://example.com/pathname?a=1#my-hash?tgWebAppData=init-data',
    { pathname: '/my-hash', hash: '', search: '?tgWebAppData=init-data' },
  ],
  [
    'launch with pathname, search and hash containing its own search specified',
    'https://example.com/pathname?a=1#my-hash?hash-search=1&tgWebAppData=init-data',
    { pathname: '/my-hash', hash: '', search: '?hash-search=1&tgWebAppData=init-data' },
  ],
])('%s', (_, url, expected) => {
  beforeEach(() => {
    vi
      .spyOn(window, 'location', 'get')
      .mockImplementation(() => ({
        href: url,
        hash: url.slice(url.indexOf('#')),
      }) as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create navigator based on the location hash', () => {
    expect(createNavigatorFromLocation().location()).toMatchObject(expected);
    expect(createNavigatorFromLocation({ hashMode: 'no-slash' }).location()).toMatchObject(expected);
    expect(createNavigatorFromLocation({ hashMode: 'slash' }).location()).toMatchObject(expected);
  });
});

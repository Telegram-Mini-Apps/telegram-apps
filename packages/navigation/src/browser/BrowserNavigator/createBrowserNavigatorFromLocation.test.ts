import { expect, describe, vi, afterEach, it, beforeEach } from 'vitest';
import {
  createBrowserNavigatorFromLocation,
} from '@/browser/BrowserNavigator/createBrowserNavigatorFromLocation.js';

describe.each([
  [
    'standard launch',
    'https://example.com/#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
    { pathname: '/', hash: '#tgWebAppData=init-data', search: '' },
  ],
  [
    'launch with pathname specified',
    'https://example.com/pathname#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
    { pathname: '/pathname', hash: '#tgWebAppData=init-data', search: '' },
  ],
  [
    'launch with pathname and search specified',
    'https://example.com/pathname?a=1#tgWebAppData=init-data',
    { pathname: '/', hash: '', search: '?tgWebAppData=init-data' },
    { pathname: '/pathname', hash: '#tgWebAppData=init-data', search: '?a=1' },
  ],
  [
    'launch with pathname, search and hash specified',
    'https://example.com/pathname?a=1#my-hash?tgWebAppData=init-data',
    { pathname: '/my-hash', hash: '', search: '?tgWebAppData=init-data' },
    { pathname: '/pathname', hash: '#my-hash?tgWebAppData=init-data', search: '?a=1' },
  ],
  [
    'launch with pathname, search and hash containing its own search specified',
    'https://example.com/pathname?a=1#my-hash?hash-search=1&tgWebAppData=init-data',
    { pathname: '/my-hash', hash: '', search: '?hash-search=1&tgWebAppData=init-data' },
    {
      pathname: '/pathname',
      hash: '#my-hash?hash-search=1&tgWebAppData=init-data',
      search: '?a=1',
    },
  ],
])('%s', (_, url, expectedHash, expectedNormal) => {
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

  describe('hash mode', () => {
    it('should create BrowserHistory based on the location hash', () => {
      expect(createBrowserNavigatorFromLocation()).toMatchObject(expectedHash);
      expect(createBrowserNavigatorFromLocation({ hashMode: 'classic' }))
        .toMatchObject(expectedHash);
      expect(createBrowserNavigatorFromLocation({ hashMode: 'slash' }))
        .toMatchObject(expectedHash);
    });
  });

  describe('mpa mode', () => {
    it('should create BrowserHistory based on the location path', () => {
      expect(createBrowserNavigatorFromLocation({ hashMode: null })).toMatchObject(expectedNormal);
    });
  });
});

import { afterEach, expect, it, vi } from 'vitest';

import { createBrowserNavigatorFromLocation } from './createBrowserNavigatorFromLocation.js';

afterEach(() => {
  vi.resetAllMocks();
});

it('should create navigator from from window.location.hash.slice(1) if hash mode is passed', () => {
  vi
    .spyOn(window, 'location', 'get')
    .mockImplementation(() => ({
      hash: '#p1?s1#h1',
      href: 'http://localhost/p2?s2#h2',
    }) as any);
  expect(createBrowserNavigatorFromLocation({ hashMode: 'default' })).toMatchObject({
    pathname: '/p1',
    search: '?s1',
    hash: '#h1',
    cursor: 0,
  });

  expect(createBrowserNavigatorFromLocation({ hashMode: 'slash' })).toMatchObject({
    pathname: '/p1',
    search: '?s1',
    hash: '#h1',
    cursor: 0,
  });
});

it('should create navigator from from window.location.href if hash mode is disabled', () => {
  vi
    .spyOn(window, 'location', 'get')
    .mockImplementation(() => ({
      hash: '#p1?s1#h1',
      href: 'http://localhost/p2?s2#h2',
    }) as any);
  expect(createBrowserNavigatorFromLocation()).toMatchObject({
    pathname: '/p2',
    search: '?s2',
    hash: '#h2',
    cursor: 0,
  });
});

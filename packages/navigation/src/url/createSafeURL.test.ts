import { expect, it } from 'vitest';

import { createSafeURL } from './createSafeURL.js';

it('should create a url with passed path pathname, hash and search', () => {
  expect(createSafeURL('/a?b#c')).toMatchObject({
    pathname: '/a',
    search: '?b',
    hash: '#c',
  });
  expect(createSafeURL({ pathname: 'a', search: 'b', hash: 'c' })).toMatchObject({
    pathname: '/a',
    search: '?b',
    hash: '#c',
  });
  expect(createSafeURL({ pathname: '/a', search: '?b', hash: '#c' })).toMatchObject({
    pathname: '/a',
    search: '?b',
    hash: '#c',
  });
});
import { expect, it } from 'vitest';
import { basicItemToBrowser } from './basicItemToBrowser.js';

it('should convert BasicNavigator history item to the one, appropriate for BrowserNavigator', () => {
  expect(basicItemToBrowser({
    id: 'abc',
    pathname: '/a',
  })).toStrictEqual({
    id: 'abc',
    hash: '',
    search: '',
    pathname: '/a',
  });

  expect(basicItemToBrowser({
    id: 'abc',
    pathname: '/a',
    params: {
      hash: 'hash',
      search: 'search',
      state: 'TEST',
    },
  })).toStrictEqual({
    id: 'abc',
    hash: 'hash',
    search: 'search',
    state: 'TEST',
    pathname: '/a',
  });
});
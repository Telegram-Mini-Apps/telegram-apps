import { expect, it } from 'vitest';
import { basicNavigatorHistoryItemToBrowser } from './basicNavigatorHistoryItemToBrowser.js';

it('should convert BasicNavigator history item to the one, appropriate for BrowserNavigator', () => {
  expect(basicNavigatorHistoryItemToBrowser({
    id: 'abc',
    pathname: '/a',
  })).toStrictEqual({
    id: 'abc',
    hash: '',
    search: '',
    pathname: '/a',
  });

  expect(basicNavigatorHistoryItemToBrowser({
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
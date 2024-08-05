import { expect, it, describe } from 'vitest';
import { prepareItem } from '@/browser/BrowserNavigator/prepareItem.js';

describe('item is string', () => {
  it(
    'should return object with fields "id" = undefined, "pathname" (value, converted to pathname) and "params", containing "hash" and "search", based on the value presented as URL and "state" = undefined',
    () => {
      expect(prepareItem('bowl', '')).toStrictEqual({
        id: undefined,
        pathname: '/bowl',
        params: {
          hash: '',
          search: '',
          state: undefined,
        },
      });

      expect(prepareItem('bowl?search', '')).toStrictEqual({
        id: undefined,
        pathname: '/bowl',
        params: {
          hash: '',
          search: '?search',
          state: undefined,
        },
      });

      expect(prepareItem('bowl?search#hash', '')).toStrictEqual({
        id: undefined,
        pathname: '/bowl',
        params: {
          hash: '#hash',
          search: '?search',
          state: undefined,
        },
      });
    },
  );

  it('should apply relative path', () => {
    expect(prepareItem('bowl', 'root/home')).toMatchObject({
      pathname: '/root/bowl',
      params: {
        hash: '',
        search: '',
      },
    });

    expect(prepareItem('bowl#hash', 'root/home')).toMatchObject({
      pathname: '/root/bowl',
      params: {
        hash: '#hash',
        search: '',
      },
    });

    expect(prepareItem('#hash', 'root/home')).toMatchObject({
      pathname: '/root/home',
      params: {
        hash: '#hash',
        search: '',
      },
    });

    expect(prepareItem('?search', 'root/home')).toMatchObject({
      pathname: '/root/home',
      params: {
        hash: '',
        search: '?search',
      },
    });

    expect(prepareItem('/bowl#hash', 'root/home')).toMatchObject({
      pathname: '/bowl',
      params: {
        hash: '#hash',
        search: '',
      },
    });
  });
});

describe('item is object', () => {
  it(
    'should return an object with fields "id" = item.id, "pathname" (item.pathname, converted to pathname) and "params", containing "hash" and "search", based on the item presented as URL and "state" = item.state',
    () => {
      expect(prepareItem({
        pathname: 'bowl',
        id: 'ID',
        state: 'STATE',
      }, '')).toStrictEqual({
        id: 'ID',
        pathname: '/bowl',
        params: {
          hash: '',
          search: '',
          state: 'STATE',
        },
      });

      expect(prepareItem({
        pathname: 'bowl',
        id: 'ID',
        state: 'STATE',
        search: '?search',
      }, '')).toStrictEqual({
        id: 'ID',
        pathname: '/bowl',
        params: {
          hash: '',
          search: '?search',
          state: 'STATE',
        },
      });

      expect(prepareItem({
        pathname: 'bowl',
        id: 'ID',
        state: 'STATE',
        hash: '#hash',
        search: '?search',
      }, '')).toStrictEqual({
        id: 'ID',
        pathname: '/bowl',
        params: {
          hash: '#hash',
          search: '?search',
          state: 'STATE',
        },
      });
    },
  );

  it('should apply relative path', () => {
    expect(prepareItem({ pathname: 'bowl' }, 'root/home')).toMatchObject({
      pathname: '/root/bowl',
      params: {
        hash: '',
        search: '',
      },
    });

    expect(prepareItem({
      pathname: 'bowl',
      hash: '#hash',
    }, 'root/home')).toMatchObject({
      pathname: '/root/bowl',
      params: {
        hash: '#hash',
        search: '',
      },
    });

    expect(prepareItem({ hash: '#hash' }, 'root/home')).toMatchObject({
      pathname: '/root/home',
      params: {
        hash: '#hash',
        search: '',
      },
    });

    expect(prepareItem({ search: '?search' }, 'root/home')).toMatchObject({
      pathname: '/root/home',
      params: {
        search: '?search',
      },
    });

    expect(prepareItem({ pathname: '/bowl', hash: '#hash' }, 'root/home')).toMatchObject({
      pathname: '/bowl',
      params: {
        hash: '#hash',
        search: '',
      },
    });
  });
});

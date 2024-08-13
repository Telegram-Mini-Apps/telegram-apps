import { expect, it, describe } from 'vitest';

import { formatItem } from './formatItem.js';

describe('item is string', () => {
  it('should return object with fields id, pathname, hash, search and state', () => {
    expect(formatItem('bowl')).toStrictEqual({
      id: expect.anything(),
      pathname: '/bowl',
      hash: '',
      search: '',
      state: undefined,
    });

    expect(formatItem('bowl?q=1#hash')).toStrictEqual({
      id: expect.anything(),
      pathname: '/bowl',
      hash: '#hash',
      search: '?q=1',
      state: undefined,
    });
  });

  it('should generate id as hexadecimal numeric string', () => {
    expect(parseInt(formatItem('bowl').id, 16)).not.toBeNaN();
  });

  it('should return frozen object', () => {
    expect(Object.isFrozen(formatItem('bowl'))).toBe(true);
  });

  describe('options', () => {
    it('should apply relativePath option', () => {
      expect(formatItem('bowl?q=1#hash', { relativePath: '/a/b' })).toStrictEqual({
        id: expect.anything(),
        pathname: '/a/bowl',
        hash: '#hash',
        search: '?q=1',
        state: undefined,
      });
    });

    it('should apply state option', () => {
      expect(formatItem('bowl?q=1#hash', { state: 'STATE' })).toStrictEqual({
        id: expect.anything(),
        pathname: '/bowl',
        hash: '#hash',
        search: '?q=1',
        state: 'STATE',
      });
    });
  });
});

describe('item is object', () => {
  it('should return object with fields id, pathname, hash, search and state', () => {
    expect(formatItem({ pathname: 'bowl' })).toStrictEqual({
      id: expect.anything(),
      pathname: '/bowl',
      hash: '',
      search: '',
      state: undefined,
    });

    expect(formatItem({
      pathname: 'bowl',
      search: '?q=1',
      hash: '#hash',
      state: 'STATE',
    })).toStrictEqual({
      id: expect.anything(),
      pathname: '/bowl',
      hash: '#hash',
      search: '?q=1',
      state: 'STATE',
    });
  });

  it('should generate id as hexadecimal numeric string', () => {
    expect(parseInt(formatItem({ pathname: 'bowl' }).id, 16)).not.toBeNaN();
  });

  it('should return frozen object', () => {
    expect(Object.isFrozen(formatItem({ pathname: 'bowl' }))).toBe(true);
  });

  describe('options', () => {
    it('should apply relativePath option', () => {
      expect(formatItem({
        pathname: 'bowl',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }, { relativePath: '/a/b' })).toStrictEqual({
        id: expect.anything(),
        pathname: '/a/bowl',
        hash: '#hash',
        search: '?q=1',
        state: 'STATE',
      });
    });
  });
});

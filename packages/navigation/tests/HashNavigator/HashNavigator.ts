import { describe, it, expect } from 'vitest';

import { HashNavigator } from '../../src/index.js';

// TODO: Add more tests.

describe('constructor', () => {
  it('should throw an error if entries list is empty', () => {
    expect(() => new HashNavigator([], 0)).toThrow('Entries list should not be empty.');
  });

  it('should throw an error if cursor equals to higher than entries count', () => {
    expect(() => new HashNavigator([{ pathname: '/' }], 1))
      .toThrow('Cursor should be less than entries count.');
    expect(() => new HashNavigator([{ pathname: '/' }], 2))
      .toThrow('Cursor should be less than entries count.');
  });
});

describe('methods', () => {
  // describe('go', () => {
  // });
  //
  // describe('forward', () => {
  // });
  //
  // describe('back', () => {
  // });

  describe('getEntries', () => {
    it('should return deep clone of navigator entries', () => {
      const initialEntries = [{
        search: '?b',
        hash: '#c',
        pathname: '/a',
      }];
      const navigator = new HashNavigator(initialEntries, 0);
      const entries = navigator.getEntries();

      expect(entries).toStrictEqual(initialEntries);
      expect(entries).not.toBe(initialEntries);

      expect(entries[0]).toStrictEqual(initialEntries[0]);
      expect(entries[0]).not.toBe(initialEntries[0]);
    });
  });

  // describe('push', () => {
  // });
  //
  describe('replace', () => {
    it('should replace current entry', () => {
      const navigator = new HashNavigator([{
        search: '?b',
        hash: '#c',
        pathname: '/a',
      }], 0);
      const [prevEntry] = navigator.getEntries();

      expect(navigator.cursor).toBe(0);
      navigator.replace('/b');
      const [entry] = navigator.getEntries();

      expect(prevEntry).not.toStrictEqual(entry);
      expect(navigator.cursor).toBe(0);
    });
  });
});

describe('getters', () => {
  describe('pathname', () => {
    it('should return current entry pathname', () => {
      expect(new HashNavigator([{ pathname: '/abc' }], 0).pathname).toBe('/abc');
    });
  });

  describe('search', () => {
    it('should return current entry search', () => {
      expect(
        new HashNavigator([{
          search: '?a=1',
          pathname: '/',
        }], 0).search,
      ).toBe('?a=1');
    });
  });

  describe('hash', () => {
    it('should return current entry hash', () => {
      expect(
        new HashNavigator([{
          hash: '#abc',
          pathname: '/',
        }], 0).hash,
      ).toBe('#abc');
    });
  });

  describe('path', () => {
    it('should combine current entry pathname, search and hash', () => {
      expect(
        new HashNavigator([{
          search: '?b',
          hash: '#c',
          pathname: '/a',
        }], 0).path,
      ).toBe('/a?b#c');
    });
  });

  describe('canGoBack', () => {
    it('should return false if cursor === 0', () => {
      expect(
        new HashNavigator([{ pathname: '/' }], 0).canGoBack,
      ).toBe(false);
    });

    it('should return true if cursor > 0', () => {
      expect(
        new HashNavigator([
          { pathname: '/a' },
          { pathname: '/b' },
        ], 1).canGoBack,
      ).toBe(true);
    });
  });

  describe('canGoForward', () => {
    it('should return false if cursor === entries.length - 1', () => {
      expect(
        new HashNavigator([{ pathname: '/' }], 0).canGoForward,
      ).toBe(false);
    });

    it('should return true if cursor < entries.length - 1', () => {
      expect(
        new HashNavigator([
          { pathname: '/a' },
          { pathname: '/b' },
        ], 0).canGoForward,
      ).toBe(true);
    });
  });
});

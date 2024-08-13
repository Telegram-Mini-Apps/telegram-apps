import { describe, expect, it } from 'vitest';

import { createNavigator } from './createNavigator.js';
import { ERR_CURSOR_INVALID, ERR_HISTORY_EMPTY } from './errors.js';

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => createNavigator([], 0)).toThrow(ERR_HISTORY_EMPTY);
  });

  it('should throw error if history index is less than 0 or higher or equal to entries list length', () => {
    expect(() => createNavigator(['/a'], -1)).toThrow(ERR_CURSOR_INVALID);
    expect(() => createNavigator(['/a'], 1)).toThrow(ERR_CURSOR_INVALID);
  });
});

// todo
// describe('attach', () => {
// });

describe('back', () => {
  it('should go back in history by 1', () => {
    const n = createNavigator(['a', 'b'], 1);
    expect(n.cursor()).toBe(1);
    n.back();
    expect(n.cursor()).toBe(0);
  });
});

// todo
// describe('detach', () => {
// });

describe('forward', () => {
  it('should go forward in history by 1', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.cursor()).toBe(0);
    n.forward();
    expect(n.cursor()).toBe(1);
  });
});

describe('go', () => {
  it('should do nothing if delta is out of bounds', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.go(2);
    expect(n.location().pathname).toBe('/a');
  });

  it('should cut delta to make it fit bounds [0, history.length) if "fit" is true', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.go(2, true);
    expect(n.location().pathname).toBe('/b');
  });

  it('should change cursor by specified delta', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.go(1);
    expect(n.location().pathname).toBe('/b');
  });
});

describe('goTo', () => {
  it('should do nothing if index is out of bounds', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.goTo(2);
    expect(n.location().pathname).toBe('/a');
  });

  it('should cut index to make it fit bounds [0, history.length) if "fit" is true', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.goTo(2, true);
    expect(n.location().pathname).toBe('/b');
  });

  it('should set cursor to specified value', () => {
    const n = createNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('/a');
    n.goTo(1);
    expect(n.location().pathname).toBe('/b');
  });
});

describe('hasNext', () => {
  it('should return true if cursor < entries.length', () => {
    expect(createNavigator(['/a'], 0).hasNext()).toBe(false);
    expect(createNavigator(['/a', '/a2'], 0).hasNext()).toBe(true);
    expect(createNavigator(['/a', '/a2'], 1).hasNext()).toBe(false);
  });
});

describe('hasPrev', () => {
  it('should return true if cursor >= 0', () => {
    expect(createNavigator(['/a'], 0).hasPrev()).toBe(false);
    expect(createNavigator(['/a', '/a2'], 0).hasPrev()).toBe(false);
    expect(createNavigator(['/a', '/a2'], 1).hasPrev()).toBe(true);
  });
});

describe('location', () => {
  it('should return currently active navigation entry', () => {
    const n = createNavigator(['/abc?q=1#hash'], 0);
    expect(n.location()).toStrictEqual({
      id: expect.anything(),
      pathname: '/abc',
      search: '?q=1',
      hash: '#hash',
      state: undefined,
    });
  });

  it('should return frozen object', () => {
    const n = createNavigator(['/abc'], 0);
    expect(Object.isFrozen(n.location())).toBe(true);
  });
});

describe('parsePath', () => {
  it('should return result based on the path\'s hash', () => {
    const n = createNavigator(['/a'], 0);
    expect(n.parsePath('/a?b#/c?d#e')).toMatchObject({
      pathname: '/c',
      search: '?d',
      hash: '#e',
    });
    expect(n.parsePath(new URL('http://abc.com/a?b#/c?d#e'))).toMatchObject({
      pathname: '/c',
      search: '?d',
      hash: '#e',
    });
  });
});

describe('push', () => {
  describe('entry is string', () => {
    it('should correctly add absolute path', () => {
      const n = createNavigator<string>(['a'], 0);
      expect(n.cursor()).toBe(0);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.push('/b?q=1#hash', 'STATE');
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);

      n.push('/c');
      expect(n.cursor()).toBe(2);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }, {
        id: expect.anything(),
        pathname: '/c',
        search: '',
        hash: '',
        state: undefined,
      }]);
    });

    it('should correctly add relative path', () => {
      const n = createNavigator<string>(['/home/profile'], 0);
      expect(n.cursor()).toBe(0);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.push('blog?q=1#hash', 'STATE');
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/home/blog',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);

      n.push('friends');
      expect(n.cursor()).toBe(2);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/home/blog',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }, {
        id: expect.anything(),
        pathname: '/home/friends',
        search: '',
        hash: '',
        state: undefined,
      }]);
    });
  });

  describe('entry is object', () => {
    it('should correctly add absolute path', () => {
      const n = createNavigator<string>(['a'], 0);
      expect(n.cursor()).toBe(0);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.push({ pathname: '/b', search: '?q=1', hash: '#hash', state: 'STATE' });
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);

      n.push({ pathname: '/c' });
      expect(n.cursor()).toBe(2);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }, {
        id: expect.anything(),
        pathname: '/c',
        search: '',
        hash: '',
        state: undefined,
      }]);
    });

    it('should correctly add relative path', () => {
      const n = createNavigator<string>(['/home/profile'], 0);
      expect(n.cursor()).toBe(0);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.push({ pathname: 'blog', search: '?q=1', hash: '#hash', state: 'STATE' });
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/home/blog',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);

      n.push({ pathname: 'friends' });
      expect(n.cursor()).toBe(2);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/home/profile',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/home/blog',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }, {
        id: expect.anything(),
        pathname: '/home/friends',
        search: '',
        hash: '',
        state: undefined,
      }]);
    });
  });

  it('should remove all entries after the current one', () => {
    const n = createNavigator(['a', 'b', 'c'], 0);
    n.push('d');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), pathname: '/a', search: '', hash: '', state: undefined },
      { id: expect.anything(), pathname: '/d', search: '', hash: '', state: undefined },
    ]);
    n.push('e');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), pathname: '/a', search: '', hash: '', state: undefined },
      { id: expect.anything(), pathname: '/d', search: '', hash: '', state: undefined },
      { id: expect.anything(), pathname: '/e', search: '', hash: '', state: undefined },
    ]);
  });
});

describe('renderPath', () => {
  it('should prefix the path with "#/" if hash mode is omitted or equal to "slash"', () => {
    const n = createNavigator([''], 0, { hashMode: 'slash' });
    expect(n.renderPath('test')).toBe('#/test');
    expect(n.renderPath('/test')).toBe('#/test');
    expect(n.renderPath('/test?a#b')).toBe('#/test?a#b');

    const n2 = createNavigator([''], 0);
    expect(n2.renderPath('test')).toBe('#/test');
    expect(n2.renderPath('/test')).toBe('#/test');
    expect(n2.renderPath('/test?a#b')).toBe('#/test?a#b');
  });

  it('should prefix the path with "#" if hash mode is equal to "no-slash"', () => {
    const n = createNavigator([''], 0, { hashMode: 'no-slash' });
    expect(n.renderPath('test')).toBe('#test');
    expect(n.renderPath('/test')).toBe('#test');
    expect(n.renderPath('/test?a#b')).toBe('#test?a#b');
  });
});

describe('replace', () => {
  describe('entry is string', () => {
    it('should correctly replace path', () => {
      const n = createNavigator<string>(['a', 'b'], 1);
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.replace('/c?q=1#hash', 'STATE');
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/c',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);
    });
  });

  describe('entry is object', () => {
    it('should correctly replace path', () => {
      const n = createNavigator<string>(['a', 'b'], 1);
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/b',
        search: '',
        hash: '',
        state: undefined,
      }]);

      n.replace({ pathname: '/c', search: '?q=1', hash: '#hash', state: 'STATE' });
      expect(n.cursor()).toBe(1);
      expect(n.history()).toStrictEqual([{
        id: expect.anything(),
        pathname: '/a',
        search: '',
        hash: '',
        state: undefined,
      }, {
        id: expect.anything(),
        pathname: '/c',
        search: '?q=1',
        hash: '#hash',
        state: 'STATE',
      }]);
    });
  });
});

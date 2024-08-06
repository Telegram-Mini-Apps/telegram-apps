import { describe, expect, it, vi } from 'vitest';

import { MemoryNavigator } from './MemoryNavigator.js';
import { ERR_NAVIGATION_CURSOR_INVALID, ERR_NAVIGATION_HISTORY_EMPTY } from '../errors.js';

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => new MemoryNavigator([], 0)).toThrow(ERR_NAVIGATION_HISTORY_EMPTY);
  });

  it('should throw error if history index is less than 0 or higher or equal to entries list length', () => {
    expect(() => new MemoryNavigator(['/a'], -1)).toThrow(ERR_NAVIGATION_CURSOR_INVALID);
    expect(() => new MemoryNavigator(['/a'], 1)).toThrow(ERR_NAVIGATION_CURSOR_INVALID);
  });
});

describe('back', () => {
  it('should call navigator\'s go method with -1', () => {
    const n = new MemoryNavigator([''], 0);
    const spy = vi.spyOn(n, 'go');
    n.back();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(-1);
  });
});

describe('forward', () => {
  it('should call navigator\'s go method with 1', () => {
    const n = new MemoryNavigator([''], 0);
    const spy = vi.spyOn(n, 'go');
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(1);
  });
});

describe('go', () => {
  it('should do nothing if delta is out of bounds', () => {
    const n = new MemoryNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('a');
    n.go(2);
    expect(n.location().pathname).toBe('a');
  });

  it('should cut delta to make it fit bounds [0, history.length) if "fit" is true', () => {
    const n = new MemoryNavigator(['a', 'b'], 0);
    expect(n.location().pathname).toBe('a');
    n.go(2, true);
    expect(n.location().pathname).toBe('b');
  });
});

describe('goTo', () => {
  it('should call navigator\'s go method with index - cursor', () => {
    const n = new MemoryNavigator(['a', 'b'], 1);
    const spy = vi.spyOn(n, 'go');
    n.goTo(10);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(9, undefined);
    spy.mockClear();

    n.goTo(20, true);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(19, true);
  });
});

describe('hasPrev', () => {
  it('should return true if cursor >= 0', () => {
    expect(new MemoryNavigator(['/a'], 0).hasPrev()).toBe(false);
    expect(new MemoryNavigator(['/a', '/a2'], 0).hasPrev()).toBe(false);
    expect(new MemoryNavigator(['/a', '/a2'], 1).hasPrev()).toBe(true);
  });
});

describe('hasNext', () => {
  it('should return true if cursor < entries.length', () => {
    expect(new MemoryNavigator(['/a'], 0).hasNext()).toBe(false);
    expect(new MemoryNavigator(['/a', '/a2'], 0).hasNext()).toBe(true);
    expect(new MemoryNavigator(['/a', '/a2'], 1).hasNext()).toBe(false);
  });
});

describe('location', () => {
  it('should return currently active navigation entry', () => {
    const n = new MemoryNavigator(['/abc'], 0);
    expect(n.location()).toMatchObject({
      pathname: '/abc',
      params: undefined,
    });
  });

  it('should return frozen object', () => {
    const n = new MemoryNavigator(['/abc'], 0);
    expect(Object.isFrozen(n.location())).toBe(true);
  });
});

describe('push', () => {
  it('should remove all entries after the current one', () => {
    const n = new MemoryNavigator(['a', 'b', 'c'], 0);
    n.push('d');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'a' },
      { id: expect.anything(), params: undefined, pathname: 'd' },
    ]);
    n.push('e');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'a' },
      { id: expect.anything(), params: undefined, pathname: 'd' },
      { id: expect.anything(), params: undefined, pathname: 'e' },
    ]);
  });
});

describe('replace', () => {
  it('should replace current entry with the specified one', () => {
    const n = new MemoryNavigator(['a'], 0);
    n.replace('b');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'b' },
    ]);
    n.replace('c');
    expect(n.history()).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'c' },
    ]);
  });
});

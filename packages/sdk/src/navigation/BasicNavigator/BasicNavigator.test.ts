import { describe, expect, it, vi } from 'vitest';

import { createError } from '@/errors/createError.js';
import { ERROR_NAVIGATION_CURSOR_INVALID, ERROR_NAVIGATION_HISTORY_EMPTY } from '@/errors/errors.js';

import { BasicNavigator } from './BasicNavigator.js';

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => new BasicNavigator([], 0)).toThrow(
      createError(ERROR_NAVIGATION_HISTORY_EMPTY, 'History should not be empty.'),
    );
  });

  it('should throw error if entries cursor is less than 0 or higher or equal to entries list length', () => {
    expect(() => new BasicNavigator(['/a'], -1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than history size.'),
    );
    expect(() => new BasicNavigator(['/a'], 1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than history size.'),
    );
  });
});

describe('back', () => {
  it('should go back in history by 1 entry', () => {
    const n = new BasicNavigator(['a', 'b'], 1);
    expect(n.historyItem.pathname).toBe('b');
    n.back();
    expect(n.historyItem.pathname).toBe('a');
  });

  it('should do nothing, if current entry is the first entry', () => {
    const n = new BasicNavigator(['a', 'b'], 0);
    expect(n.historyItem.pathname).toBe('a');
    n.back();
    expect(n.historyItem.pathname).toBe('a');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BasicNavigator<string>([
      { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      { id: 'bId', pathname: 'bPathname', params: 'bParams' },
    ], 1);
    const spy = vi.fn();
    n.on('change', spy);
    n.back();
    n.back();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      to: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      delta: -1,
    });
  });
});

describe('cursor', () => {
  it('should return current cursor', () => {
    expect(new BasicNavigator(['/'], 0).cursor).toBe(0);
    expect(new BasicNavigator(['/', '/'], 1).cursor).toBe(1);
  });
});

describe('historyItem', () => {
  it('should return currently active navigation entry', () => {
    const n = new BasicNavigator(['/abc'], 0);
    expect(n.historyItem).toMatchObject({
      pathname: '/abc',
      params: undefined,
    });
  });

  it('should return frozen object', () => {
    const n = new BasicNavigator(['/abc'], 0);
    expect(Object.isFrozen(n.historyItem)).toBe(true);
  });
});

describe('hasPrev', () => {
  it('should return true if cursor >= 0', () => {
    expect(new BasicNavigator(['/a'], 0).hasPrev).toBe(false);
    expect(new BasicNavigator(['/a', '/a2'], 0).hasPrev).toBe(false);
    expect(new BasicNavigator(['/a', '/a2'], 1).hasPrev).toBe(true);
  });
});

describe('hasNext', () => {
  it('should return true if cursor < entries.length', () => {
    expect(new BasicNavigator(['/a'], 0).hasNext).toBe(false);
    expect(new BasicNavigator(['/a', '/a2'], 0).hasNext).toBe(true);
    expect(new BasicNavigator(['/a', '/a2'], 1).hasNext).toBe(false);
  });
});

describe('forward', () => {
  it('should go forward in history by 1 entry', () => {
    const n = new BasicNavigator(['a', 'b'], 0);
    expect(n.historyItem.pathname).toBe('a');
    n.forward();
    expect(n.historyItem.pathname).toBe('b');
  });

  it('should do nothing, if current entry is the last entry', () => {
    const n = new BasicNavigator(['a', 'b'], 1);
    expect(n.historyItem.pathname).toBe('b');
    n.forward();
    expect(n.historyItem.pathname).toBe('b');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BasicNavigator<string>([
      { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      { id: 'bId', pathname: 'bPathname', params: 'bParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.forward();
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      to: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      delta: 1,
    });
  });
});

describe('go', () => {
  it('should do nothing if delta is 0 or out of bounds', () => {
    const n = new BasicNavigator(['a', 'b'], 0);
    expect(n.historyItem.pathname).toBe('a');
    n.go(0);
    expect(n.historyItem.pathname).toBe('a');
    n.go(2);
    expect(n.historyItem.pathname).toBe('a');
  });

  it('should cut delta and make point cursor to the nearest available entry if performCut option is true', () => {
    const n = new BasicNavigator(['a', 'b'], 0);
    expect(n.historyItem.pathname).toBe('a');
    n.go(2, true);
    expect(n.historyItem.pathname).toBe('b');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BasicNavigator<string>([
      { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      { id: 'bId', pathname: 'bPathname', params: 'bParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.go(1);
    n.go(1);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      to: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      delta: 1,
    });
    spy.mockClear();

    n.go(-100, true);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      to: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      delta: -1,
    });
  });
});

describe('on', () => {
  it('should remove event listener if returned function was called', () => {
    const n = new BasicNavigator(['a', 'b', 'c'], 0);
    const spy = vi.fn();
    const off = n.on('change', spy);
    n.forward();
    off();
    n.forward();
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('off', () => {
  it('should remove specified event listener', () => {
    const n = new BasicNavigator(['a', 'b', 'c'], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.forward();
    n.off('change', spy);
    n.forward();
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('push', () => {
  it('should remove all entries after the current one', () => {
    const n = new BasicNavigator(['a', 'b', 'c'], 0);
    n.push('d');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'a' },
      { id: expect.anything(), params: undefined, pathname: 'd' },
    ]);
    n.push('e');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'a' },
      { id: expect.anything(), params: undefined, pathname: 'd' },
      { id: expect.anything(), params: undefined, pathname: 'e' },
    ]);
  });

  it('should emit "change" event', () => {
    const n = new BasicNavigator<string>([
      { id: 'aId', pathname: 'aPathname', params: 'aParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.push({ id: 'bId', pathname: 'bPathname', params: 'bParams' });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      to: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      delta: 1,
    });
  });
});

describe('replace', () => {
  it('should replace current entry with the specified one', () => {
    const n = new BasicNavigator(['a'], 0);
    n.replace('b');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'b' },
    ]);
    n.replace('c');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), params: undefined, pathname: 'c' },
    ]);
  });

  it('should emit "change" event', () => {
    const n = new BasicNavigator<string>([
      { id: 'aId', pathname: 'aPathname', params: 'aParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.replace({ id: 'bId', pathname: 'bPathname', params: 'bParams' });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: 'aPathname', params: 'aParams' },
      to: { id: 'bId', pathname: 'bPathname', params: 'bParams' },
      delta: 0,
    });
  });
});

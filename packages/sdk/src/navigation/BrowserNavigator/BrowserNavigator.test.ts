import { afterEach, describe, expect, it, vi } from 'vitest';

import { createError } from '@/errors/createError.js';
import {
  ERROR_NAVIGATION_CURSOR_INVALID,
  ERROR_NAVIGATION_HISTORY_EMPTY,
} from '@/errors/errors.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';

import { BrowserNavigator } from './BrowserNavigator.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { createWindow } from '@test-utils/createWindow.js';

afterEach(() => {
  resetMiniAppsEventEmitter();
  vi.restoreAllMocks();
});

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => new BrowserNavigator([], 0)).toThrow(
      createError(ERROR_NAVIGATION_HISTORY_EMPTY, 'History should not be empty.'),
    );
  });

  it('should throw error if entries cursor is less than 0 or higher or equal to entries list length', () => {
    expect(() => new BrowserNavigator(['/a'], -1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than history size.'),
    );
    expect(() => new BrowserNavigator(['/a'], 1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than history size.'),
    );
  });
});

describe('attach', () => {
  it('should add "back_button_pressed" event listener calling navigator.back() method', async () => {
    createWindow({
      env: 'iframe',
      history: {
        length: 1,
        pushState: vi.fn(),
        replaceState: vi.fn(),
        go: vi.fn(),
      },
    } as any);
    const n = new BrowserNavigator(['a', 'b'], 1);
    expect(n.pathname).toBe('/b');
    await n.attach();
    dispatchWindowMessageEvent('back_button_pressed');
    expect(n.pathname).toBe('/a');
  });

  // it('should synchronize state with the browser history', () => {
  //   const pushState = vi.fn();
  //   createWindow({
  //     env: 'iframe',
  //     history: {
  //       length: 10,
  //       pushState,
  //       replaceState: vi.fn(),
  //       go: vi.fn(),
  //     }
  //   } as any);
  //   const n = new BrowserNavigator(['a', 'b'], 1);
  //   await n.attach();
  //   dispatchWindowMessageEvent('back_button_pressed');
  //   expect(n.pathname).toBe('/a');
  // });
  //
  // it('should start calling history synchronization after navigator changes', () => {
  //   createWindow({
  //     env: 'iframe',
  //     history: {
  //       length: 0,
  //       pushState: vi.fn(),
  //       replaceState: vi.fn(),
  //       go: vi.fn(),
  //     }
  //   } as any);
  //   const n = new BrowserNavigator(['a', 'b'], 1);
  //   expect(n.pathname).toBe('/b');
  //   await n.attach();
  //   dispatchWindowMessageEvent('back_button_pressed');
  //   expect(n.pathname).toBe('/a');
  // });
});

describe('back', () => {
  it('should go back in history by 1 entry', () => {
    const n = new BrowserNavigator(['a', 'b'], 1);
    expect(n.pathname).toBe('/b');
    n.back();
    expect(n.pathname).toBe('/a');
  });

  it('should do nothing, if current entry is the first entry', () => {
    const n = new BrowserNavigator(['a', 'b'], 0);
    expect(n.pathname).toBe('/a');
    n.back();
    expect(n.pathname).toBe('/a');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BrowserNavigator<string>([
      { id: 'aId', pathname: 'aPathname' },
      { id: 'bId', pathname: 'bPathname' },
    ], 1);
    const spy = vi.fn();
    n.on('change', spy);
    n.back();
    n.back();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: {
        id: 'bId',
        hash: '',
        search: '',
        pathname: '/bPathname',
      },
      to: {
        id: 'aId',
        hash: '',
        search: '',
        pathname: '/aPathname',
      },
      delta: -1,
    });
  });
});

describe('cursor', () => {
  it('should return current cursor', () => {
    expect(new BrowserNavigator(['/'], 0).cursor).toBe(0);
    expect(new BrowserNavigator(['/', '/'], 1).cursor).toBe(1);
  });
});

// describe('dettach', () => {
//
// });

describe('forward', () => {
  it('should go forward in history by 1 entry', () => {
    const n = new BrowserNavigator(['a', 'b'], 0);
    expect(n.pathname).toBe('/a');
    n.forward();
    expect(n.pathname).toBe('/b');
  });

  it('should do nothing, if current entry is the last entry', () => {
    const n = new BrowserNavigator(['a', 'b'], 1);
    expect(n.pathname).toBe('/b');
    n.forward();
    expect(n.pathname).toBe('/b');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BrowserNavigator<string>([
      { id: 'aId', pathname: 'aPathname' },
      { id: 'bId', pathname: 'bPathname' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.forward();
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: {
        id: 'aId',
        hash: '',
        search: '',
        pathname: '/aPathname',
      },
      to: {
        id: 'bId',
        hash: '',
        search: '',
        pathname: '/bPathname',
      },
      delta: 1,
    });
  });
});

describe('go', () => {
  it('should do nothing if delta is 0 or out of bounds', () => {
    const n = new BrowserNavigator(['a', 'b'], 0);
    expect(n.pathname).toBe('/a');
    n.go(0);
    expect(n.pathname).toBe('/a');
    n.go(2);
    expect(n.pathname).toBe('/a');
  });

  it('should cut delta and make point cursor to the nearest available entry if performCut option is true', () => {
    const n = new BrowserNavigator(['a', 'b'], 0);
    expect(n.pathname).toBe('/a');
    n.go(2, true);
    expect(n.pathname).toBe('/b');
  });

  it('should emit "change" event, if entry was changed', () => {
    const n = new BrowserNavigator<string>([
      { id: 'aId', pathname: 'aPathname' },
      { id: 'bId', pathname: 'bPathname' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.go(1);
    n.go(1);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: {
        id: 'aId',
        hash: '',
        search: '',
        pathname: '/aPathname',
      },
      to: {
        id: 'bId',
        hash: '',
        search: '',
        pathname: '/bPathname',
      },
      delta: 1,
    });
    spy.mockClear();

    n.go(-100, true);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: {
        id: 'bId',
        hash: '',
        search: '',
        pathname: '/bPathname',
      },
      to: {
        id: 'aId',
        hash: '',
        search: '',
        pathname: '/aPathname',
      },
      delta: -1,
    });
  });
});

describe('hash', () => {
  it('should return current entry hash', () => {
    expect(new BrowserNavigator(['/a'], 0).hash).toBe('');
    expect(new BrowserNavigator(['/a#'], 0).hash).toBe('');
    expect(new BrowserNavigator(['/a#hash'], 0).hash).toBe('#hash');

    expect(new BrowserNavigator([{ pathname: '/a' }], 0).hash).toBe('');
    expect(new BrowserNavigator([{ pathname: '/a', hash: '#' }], 0).hash).toBe('');
    expect(new BrowserNavigator([{ pathname: '/a', hash: '#hash' }], 0).hash).toBe('#hash');
  });
});

describe('history', () => {
  it('should return current navigation history', () => {
    const n = new BrowserNavigator(['/a?b#c', '/d?e#f'], 0);
    expect(n.history).toStrictEqual([
      { pathname: '/a', search: '?b', hash: '#c', state: undefined, id: expect.anything() },
      { pathname: '/d', search: '?e', hash: '#f', state: undefined, id: expect.anything() },
    ]);
  });
});

describe('hasPrev', () => {
  it('should return true if cursor >= 0', () => {
    expect(new BrowserNavigator(['/a'], 0).hasPrev).toBe(false);
    expect(new BrowserNavigator(['/a', '/a2'], 0).hasPrev).toBe(false);
    expect(new BrowserNavigator(['/a', '/a2'], 1).hasPrev).toBe(true);
  });
});

describe('hasNext', () => {
  it('should return true if cursor < entries.length', () => {
    expect(new BrowserNavigator(['/a'], 0).hasNext).toBe(false);
    expect(new BrowserNavigator(['/a', '/a2'], 0).hasNext).toBe(true);
    expect(new BrowserNavigator(['/a', '/a2'], 1).hasNext).toBe(false);
  });
});

describe('on', () => {
  it('should remove event listener if returned function was called', () => {
    const n = new BrowserNavigator(['a', 'b', 'c'], 0);
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
    const n = new BrowserNavigator(['a', 'b', 'c'], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.forward();
    n.off('change', spy);
    n.forward();
    n.forward();
    expect(spy).toHaveBeenCalledOnce();
  });
});

describe('path', () => {
  it('should return current entry complete path', () => {
    expect(new BrowserNavigator(['/a'], 0).path).toBe('/a');
    expect(new BrowserNavigator(['/a?s'], 0).path).toBe('/a?s');
    expect(new BrowserNavigator(['/a#h'], 0).path).toBe('/a#h');
    expect(new BrowserNavigator(['/a?s#h'], 0).path).toBe('/a?s#h');

    expect(new BrowserNavigator([{ pathname: '/a' }], 0).path).toBe('/a');
    expect(new BrowserNavigator([{ pathname: '/a', search: 's' }], 0).path).toBe('/a?s');
    expect(new BrowserNavigator([{ pathname: '/a', hash: 'h' }], 0).path).toBe('/a#h');
    expect(new BrowserNavigator([{
      pathname: '/a',
      search: 's',
      hash: 'h',
    }], 0).path).toBe('/a?s#h');
  });
});

describe('parsePath', () => {
  it('should return result based on the whole path if hash mode is omitted', () => {
    const n = new BrowserNavigator(['/a'], 0);
    expect(n.parsePath('/a?b#c')).toStrictEqual({
      pathname: '/a',
      search: '?b',
      hash: '#c',
    });
    expect(n.parsePath(new URL('http://abc.com/a?b#c'))).toStrictEqual({
      pathname: '/a',
      search: '?b',
      hash: '#c',
    });
  });

  it('should return result based on the path\'s hash if hash mode is specified', () => {
    const n = new BrowserNavigator(['/a'], 0, 'default');
    expect(n.parsePath('/a?b#/c?d#e')).toStrictEqual({
      pathname: '/c',
      search: '?d',
      hash: '#e',
    });
    expect(n.parsePath(new URL('http://abc.com/a?b#/c?d#e'))).toStrictEqual({
      pathname: '/c',
      search: '?d',
      hash: '#e',
    });
  });
});

describe('push', () => {
  it('should remove all entries after the current one', () => {
    const n = new BrowserNavigator(['a', 'b', 'c'], 0);
    n.push('d');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), state: undefined, pathname: '/a', hash: '', search: '' },
      { id: expect.anything(), state: undefined, pathname: '/d', hash: '', search: '' },
    ]);
    n.push('e');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), state: undefined, pathname: '/a', hash: '', search: '' },
      { id: expect.anything(), state: undefined, pathname: '/d', hash: '', search: '' },
      { id: expect.anything(), state: undefined, pathname: '/e', hash: '', search: '' },
    ]);
  });

  it('should emit "change" event', () => {
    const n = new BrowserNavigator<string>([
      { id: 'aId', pathname: 'aPathname', state: 'aParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.push({ id: 'bId', pathname: 'bPathname', state: 'bParams' });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: '/aPathname', state: 'aParams', hash: '', search: '' },
      to: { id: 'bId', pathname: '/bPathname', state: 'bParams', hash: '', search: '' },
      delta: 1,
    });
  });
});

describe('replace', () => {
  it('should replace current entry with the specified one', () => {
    const n = new BrowserNavigator(['a'], 0);
    n.replace('d');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), state: undefined, pathname: '/d', hash: '', search: '' },
    ]);
    n.replace('e');
    expect(n.history).toStrictEqual([
      { id: expect.anything(), state: undefined, pathname: '/e', hash: '', search: '' },
    ]);
  });

  it('should emit "change" event', () => {
    const n = new BrowserNavigator<string>([
      { id: 'aId', pathname: 'aPathname', state: 'aParams' },
    ], 0);
    const spy = vi.fn();
    n.on('change', spy);
    n.replace({ id: 'bId', pathname: 'bPathname', state: 'bParams' });

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith({
      navigator: n,
      from: { id: 'aId', pathname: '/aPathname', state: 'aParams', hash: '', search: '' },
      to: { id: 'bId', pathname: '/bPathname', state: 'bParams', hash: '', search: '' },
      delta: 0,
    });
  });
});

describe('pathname', () => {
  it('should return current entry pathname', () => {
    expect(new BrowserNavigator(['/a'], 0).pathname).toBe('/a');
    expect(new BrowserNavigator(['/a#hash'], 0).pathname).toBe('/a');
    expect(new BrowserNavigator(['/a?search'], 0).pathname).toBe('/a');

    expect(new BrowserNavigator([{ pathname: '/a' }], 0).pathname).toBe('/a');
    expect(new BrowserNavigator([{ pathname: '/a', hash: '#hash' }], 0).pathname).toBe('/a');
    expect(new BrowserNavigator([{ pathname: '/a', search: '?search' }], 0).pathname).toBe('/a');
  });
});

describe('renderPath', () => {
  it('should convert passed historyItem to the path', () => {
    const n = new BrowserNavigator([''], 0);
    expect(n.renderPath('test')).toBe('/test');
    expect(n.renderPath('/test')).toBe('/test');
    expect(n.renderPath('/test?a#b')).toBe('/test?a#b');
  });

  it('should convert passed historyItem to the path prepending with "#/" if hash mode is "slash"', () => {
    const n = new BrowserNavigator([''], 0, 'slash');
    expect(n.renderPath('test')).toBe('#/test');
    expect(n.renderPath('/test')).toBe('#/test');
    expect(n.renderPath('/test?a#b')).toBe('#/test?a#b');
  });

  it('should convert passed historyItem to the path prepending with "#" if hash mode is "default"', () => {
    const n = new BrowserNavigator([''], 0, 'default');
    expect(n.renderPath('test')).toBe('#test');
    expect(n.renderPath('/test')).toBe('#test');
    expect(n.renderPath('/test?a#b')).toBe('#test?a#b');
  });
});

describe('search', () => {
  it('should return current entry query parameters', () => {
    expect(new BrowserNavigator(['/a'], 0).search).toBe('');
    expect(new BrowserNavigator(['/a?'], 0).search).toBe('');
    expect(new BrowserNavigator(['/a?search'], 0).search).toBe('?search');

    expect(new BrowserNavigator([{ pathname: '/a' }], 0).search).toBe('');
    expect(new BrowserNavigator([{ pathname: '/a', search: '?' }], 0).search).toBe('');
    expect(new BrowserNavigator([{ pathname: '/a', search: '?search' }], 0).search).toBe('?search');
  });
});

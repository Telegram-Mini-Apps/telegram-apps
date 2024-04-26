import { describe, expect, it } from 'vitest';

import { createError } from '@/errors/createError.js';
import { ERROR_NAVIGATION_CURSOR_INVALID, ERROR_NAVIGATION_LIST_EMPTY } from '@/errors/errors.js';

import { BrowserNavigator } from './BrowserNavigator.js';

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => new BrowserNavigator([], 0)).toThrow(
      createError(ERROR_NAVIGATION_LIST_EMPTY, 'Entries list should not be empty.'),
    );
  });

  it('should throw error if entries cursor is less than 0 or higher or equal to entries list length', () => {
    expect(() => new BrowserNavigator(['/a'], -1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than entries count.'),
    );
    expect(() => new BrowserNavigator(['/a'], 1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than entries count.'),
    );
  });
});

// describe('attach', () => {
//
// });

// describe('back', () => {
//
// });

describe('cursor', () => {
  it('should return current cursor', () => {
    expect(new BrowserNavigator(['/'], 0).cursor).toBe(0);
    expect(new BrowserNavigator(['/', '/'], 1).cursor).toBe(1);
  });
});

// describe('dettach', () => {
//
// });

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

// describe('forward', () => {
//
// });

// describe('go', () => {
//
// });

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

// describe('on', () => {
//
// });

// describe('off', () => {
//
// });

describe('path', () => {
  it('should return current entry complete path', () => {
    expect(new BrowserNavigator(['/a'], 0).path).toBe('/a');
    expect(new BrowserNavigator(['/a?s'], 0).path).toBe('/a?s');
    expect(new BrowserNavigator(['/a#h'], 0).path).toBe('/a#h');
    expect(new BrowserNavigator(['/a?s#h'], 0).path).toBe('/a?s#h');

    expect(new BrowserNavigator([{ pathname: '/a' }], 0).path).toBe('/a');
    expect(new BrowserNavigator([{ pathname: '/a', search: 's' }], 0).path).toBe('/a?s');
    expect(new BrowserNavigator([{ pathname: '/a', hash: 'h' }], 0).path).toBe('/a#h');
    expect(new BrowserNavigator([{ pathname: '/a', search: 's', hash: 'h' }], 0).path).toBe('/a?s#h');
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

// describe('push', () => {
//
// });

// describe('replace', () => {
//
// });

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

import { describe, expect, it } from 'vitest';

import { createError } from '@/errors/createError.js';
import { ERROR_NAVIGATION_CURSOR_INVALID, ERROR_NAVIGATION_LIST_EMPTY } from '@/errors/errors.js';

import { BasicNavigator } from './BasicNavigator.js';

describe('constructor', () => {
  it('should throw error if entries list is empty', () => {
    expect(() => new BasicNavigator([], 0)).toThrow(
      createError(ERROR_NAVIGATION_LIST_EMPTY, 'Entries list should not be empty.'),
    );
  });

  it('should throw error if entries cursor is less than 0 or higher or equal to entries list length', () => {
    expect(() => new BasicNavigator(['/a'], -1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than entries count.'),
    );
    expect(() => new BasicNavigator(['/a'], 1)).toThrow(
      createError(ERROR_NAVIGATION_CURSOR_INVALID, 'Cursor should not be zero and higher or equal than entries count.'),
    );
  });
});

// describe('back', () => {
//
// });

describe('cursor', () => {
  it('should return current cursor', () => {
    expect(new BasicNavigator(['/'], 0).cursor).toBe(0);
    expect(new BasicNavigator(['/', '/'], 1).cursor).toBe(1);
  });
});

describe('entry', () => {
  it('should return currently active navigation entry', () => {
    const n = new BasicNavigator(['/abc'], 0);
    expect(n.entry).toMatchObject({
      pathname: '/abc',
      params: undefined,
    });
  });

  it('should return frozen object', () => {
    const n = new BasicNavigator(['/abc'], 0);
    expect(Object.isFrozen(n.entry)).toBe(true);
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

// describe('forward', () => {
//
// });

// describe('go', () => {
//
// });

// describe('on', () => {
//
// });

// describe('off', () => {
//
// });

// describe('push', () => {
//
// });

// describe('replace', () => {
//
// });

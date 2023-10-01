import { expect, test } from 'vitest';
import { classNames } from '../../src/index.js';

test('styles', () => {
  test('classNames.ts', () => {
    test('classNames', () => {
      test('should ignore all non-empty strings and objects', () => {
        expect(classNames('', 2, 'b', null, undefined, false, true, [], 'a', 'c')).toBe('b a c');
      });

      test('should pick only keys which values are truthy', () => {
        expect(classNames({
          a: true,
          b: null,
          c: false,
          d: undefined,
          e: {},
          f: 3,
          g: 0,
          h: '',
        })).toBe('a e f');
      });
    });
  });
});

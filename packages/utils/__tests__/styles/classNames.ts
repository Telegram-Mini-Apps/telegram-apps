import { classNames } from '../../src/index.js';

describe('styles', () => {
  describe('classNames.ts', () => {
    describe('classNames', () => {
      it('should ignore all non-empty strings and objects', () => {
        expect(classNames('', 2, 'b', null, undefined, false, true, [], 'a', 'c')).toBe('b a c');
      });

      it('should pick only keys which values are truthy', () => {
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

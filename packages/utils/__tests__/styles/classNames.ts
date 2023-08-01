import { classNames } from '../../src';

describe('styles', () => {
  describe('classNames.ts', () => {
    describe('classNames', () => {
      it('should ignore values undefined, null, boolean and empty strings', () => {
        expect(classNames(undefined, null, true, false, '')).toBe('');
      });

      it('should join with space non-empty strings and numbers', () => {
        expect(classNames('a', 123)).toBe('a 123');
      });

      it('should pick only keys which values are true', () => {
        expect(classNames({
          a: true,
          b: null,
          c: false,
          d: undefined,
          e: true,
        })).toBe('a e');
      });
    });
  });
});

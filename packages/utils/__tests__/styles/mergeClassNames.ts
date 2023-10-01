import { expect, test } from 'vitest';
import { mergeClassNames } from '../../src/index.js';

test('styles', () => {
  test('mergeClassNames.ts', () => {
    test('mergeClassNames', () => {
      test('should ignore non-object values', () => {
        expect(mergeClassNames({}, null, undefined, false, true, {}));
      });

      test('should merge objects keys by values applying classNames function', () => {
        expect(mergeClassNames(
          { a: 'hey there', b: 'space' },
          { a: 'John', b: 'station' },
          { c: 'wowow' },
          { f: { mod: true, ignore: false, add: 'non empty string' } },
        )).toStrictEqual({
          a: 'hey there John',
          b: 'space station',
          c: 'wowow',
          f: 'mod add',
        });
      });
    });
  });
});

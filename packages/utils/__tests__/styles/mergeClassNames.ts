import { mergeClassNames } from '../../src';

describe('styles', () => {
  describe('mergeClassNames.ts', () => {
    describe('mergeClassNames', () => {
      it('should ignore undefined properties', () => {
        expect(mergeClassNames({ a: undefined }, { b: undefined })).toStrictEqual({});
      });

      it('should concatenate values with the same keys', () => {
        expect(mergeClassNames({
            a: 'hey there',
            b: 'space',
          }, {
            a: 'John',
            b: 'station',
          })).toStrictEqual({
          a: 'hey there John',
          b: 'space station',
        });
      });

      it('should take key value in case it is missing in one of the objects', () => {
        expect(mergeClassNames({
          a: 'hey there',
        }, {
          b: 'station',
        })).toStrictEqual({
          a: 'hey there',
          b: 'station',
        });
      });
    });
  });
});

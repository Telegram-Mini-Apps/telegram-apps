import {describe, expect, it} from '@jest/globals';
import {compareVersions, requireVersion} from './version';

describe('utils', () => {
  describe('version', () => {
    describe('compareVersions', () => {
      it('should return 1 in case "a" is greater than "b"', () => {
        expect(compareVersions('6.1', '6.0')).toBe(1);
      });

      it('should return 0 in case "a" is equal ot "b"', () => {
        expect(compareVersions('6', '6.0')).toBe(0);
      });

      it('should return -1 in case "a" is lower than "b"', () => {
        expect(compareVersions('5', '6.0')).toBe(-1);
      });
    });

    describe('requireVersion', () => {
      it(
        'should not throw an error in case "checkedVersion" is ' +
        'greater than or equal to "minVersion"', () => {
          expect(() => requireVersion('6.0', '7')).not.toThrow();
          expect(() => requireVersion('6.0', '6.1')).not.toThrow();
          expect(() => requireVersion('6.0', '6')).not.toThrow();
        },
      );

      it(
        'should throw an error in case "checkedVersion" is ' +
        'lower than "minVersion"', () => {
          expect(() => requireVersion('6.1', '6.0')). toThrow();
        },
      );
    });
  });
});
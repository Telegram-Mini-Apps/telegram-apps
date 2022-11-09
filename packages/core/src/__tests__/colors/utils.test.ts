import {describe, expect, it} from '@jest/globals';
import {isColorDark} from '../../colors/utils';

describe('colors', () => {
  describe('utils', () => {
    describe('isColorDark', () => {
      it('should throw an error in case, non-RGB value passed', () => {
        expect(() => isColorDark('abc')).toThrow();
      });

      it('should return true in case, color hsp is less than 120', () => {
        expect(isColorDark('#000')).toBe(true);
      });

      it('should return false in case, color hsp is more than or equal to 120', () => {
        expect(isColorDark('#fff')).toBe(false);
      })
    })
  });
});
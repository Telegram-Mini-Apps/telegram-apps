import {describe, expect, it} from '@jest/globals';
import {extractInitDataFromSearchParams} from './parsing';

describe('parsing', () => {
  describe('extractInitDataFromSearchParams', () => {
    it('should throw an error in case, passed value does not match required schema', () => {
      expect(() => extractInitDataFromSearchParams('hash=someHash')).toThrow();
    });

    it('should return result in case, passed value matches schema', () => {
      expect(extractInitDataFromSearchParams('hash=someHash&auth_date=123')).toStrictEqual({
        hash: 'someHash',
        authDate: new Date(123000)
      });
    })
  })
})
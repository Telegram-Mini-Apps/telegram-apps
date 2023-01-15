import {describe, jest, expect, it} from '@jest/globals';
import {log} from '../logging';

const now = new Date('2022-11-04T09:09:43.007Z');
jest.useFakeTimers().setSystemTime(now);

describe('logging', () => {
  describe('log', () => {
    it('should call console.log if level is "log"', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      log('log');
      expect(spy).toBeCalled();
    });

    it('should call console.error if level is "error"', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      log('error');
      expect(spy).toBeCalled();
    });
  })
})
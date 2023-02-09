import {describe, expect, it, jest} from '@jest/globals';
import {init} from '../src/init';
import {Bridge} from '../src/Bridge';

describe('init.ts', () => {
  describe('init', () => {
    it('should call Bridge.init', () => {
      const spy = jest.spyOn(Bridge, 'init');
      expect(spy).toHaveBeenCalledTimes(0);
      init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  })
})
import {describe, expect, it, jest} from '@jest/globals';
import {init} from '../init';
import {Bridge} from '../Bridge';

describe('init', () => {
  describe('init', () => {
    it('should call Bridge.init', () => {
      const spy = jest.spyOn(Bridge, 'init');
      expect(spy).toHaveBeenCalledTimes(0);
      init();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  })
})
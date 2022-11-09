import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import * as eventReceiverPkg from '../event-receiver';
import {init} from '../init';

jest.mock('../event-receiver');

const {defineEventReceiver, getGlobalEventEmitter} = eventReceiverPkg;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('init', () => {
  describe('init', () => {
    it('should define event receiver function in case, its option is not specified', () => {
      init()
      expect(defineEventReceiver).toBeCalled();
    });

    it('should use global event emitter in case, it is not specified', () => {
      expect((init() as any).emitter).toBe(getGlobalEventEmitter());
    });
  })
})
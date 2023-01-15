import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {EventEmitter} from '../../EventEmitter/EventEmitter';

interface EventsMap {
  test: (a: number, b: boolean) => void;
  hey: never;
}

let ee: EventEmitter<EventsMap>;

beforeEach(() => {
  ee = new EventEmitter<EventsMap>();
});

describe('lib', () => {
  describe('EventEmitter', () => {
    describe('on', () => {
      it('should emit bound listener with specified arguments', () => {
        const listener = jest.fn();
        ee.on('test', listener);
        ee.emit('test', 1, true);
        expect(listener).toBeCalledWith(1, true);
      });

      it('should not remove previously added listeners', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();
        ee.on('test', listener1);
        ee.on('test', listener2);
        ee.emit('test', 1, true);
        expect(listener1).toBeCalledWith(1, true);
        expect(listener2).toBeCalledWith(1, true);
      })

      it('should not emit bound listener in case, event name does not match', () => {
        const listener = jest.fn();
        ee.on('test', listener);
        ee.emit('hey');
        expect(listener).not.toBeCalled();
      });
    });

    describe('off', () => {
      it('should not emit bound listener in case, it was unbound', () => {
        const listener = jest.fn();
        ee.on('test', listener);
        ee.off('test', listener);
        ee.emit('test', 1, true);
        expect(listener).not.toBeCalled();
      });

      it('should not do anything in case, event has no listeners', () => {
        expect(() => {
          const listener = jest.fn();
          ee.off('test', listener);
        }).not.toThrow();
      })
    });

    describe('subscribe', () => {
      it('should emit any event', () => {
        const listener = jest.fn();
        ee.subscribe(listener);
        ee.emit('test', 1, true);
        ee.emit('hey');
        expect(listener).toBeCalledTimes(2);
      });
    });

    describe('unsubscribe', () => {
      it('should not emit event if it was unbound', () => {
        const listener = jest.fn();
        ee.subscribe(listener);
        ee.unsubscribe(listener);
        ee.emit('test', 1, true);
        expect(listener).not.toBeCalled();
      });
    });
  });
});
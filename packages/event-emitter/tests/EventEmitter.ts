import { expect, it, beforeEach, vi, describe } from 'vitest';

import { EventEmitter } from '../src/index.js';

interface EventsMap {
  test: (a: number, b: boolean) => void;
  hey: never;
}

let ee: EventEmitter<EventsMap>;

beforeEach(() => {
  ee = new EventEmitter<EventsMap>();
});

describe('EventEmitter.ts', () => {
  describe('EventEmitter', () => {
    describe('on', () => {
      it('should emit bound listener with specified arguments', () => {
        const listener = vi.fn();
        ee.on('test', listener);
        ee.emit('test', 1, true);
        expect(listener).toBeCalledWith(1, true);
      });

      it('should not remove previously added listeners', () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();
        ee.on('test', listener1);
        ee.on('test', listener2);
        ee.emit('test', 1, true);
        expect(listener1).toBeCalledWith(1, true);
        expect(listener2).toBeCalledWith(1, true);
      });

      it('should not emit bound listener in case, event name does not match', () => {
        const listener = vi.fn();
        ee.on('test', listener);
        ee.emit('hey');
        expect(listener).not.toBeCalled();
      });
    });

    describe('once', () => {
      it('should call listener only once', () => {
        const listener = vi.fn();
        ee.once('test', listener);
        ee.emit('test', 1, true);
        ee.emit('test', 1, true);
        ee.emit('test', 1, true);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(1, true);
      });

      it('should remove all same listeners bound to the same event', () => {
        const listener = vi.fn();
        ee.once('test', listener);
        ee.once('test', listener);
        ee.emit('test', 1, true);
        ee.emit('test', 1, true);
        ee.emit('test', 1, true);
        expect(listener).toHaveBeenCalledTimes(2);
      });
    });

    describe('off', () => {
      it('should not emit bound listener in case, it was unbound', () => {
        const listener = vi.fn();
        ee.on('test', listener);
        ee.off('test', listener);
        ee.emit('test', 1, true);
        expect(listener).not.toBeCalled();
      });

      it('should not do anything in case, event has no listeners', () => {
        expect(() => {
          const listener = vi.fn();
          ee.off('test', listener);
        }).not.toThrow();
      });

      it('should remove event listener bound via "once" method', () => {
        const listener = vi.fn();
        ee.once('test', listener);
        ee.off('test', listener);
        ee.emit('test', 1, true);
        expect(listener).not.toBeCalled();
      });
    });

    describe('subscribe', () => {
      it('should emit any event', () => {
        const listener = vi.fn();
        ee.subscribe(listener);
        ee.emit('test', 1, true);
        ee.emit('hey');
        expect(listener).toBeCalledTimes(2);
      });
    });

    describe('unsubscribe', () => {
      it('should not emit event if it was unbound', () => {
        const listener = vi.fn();
        ee.subscribe(listener);
        ee.unsubscribe(listener);
        ee.emit('test', 1, true);
        expect(listener).not.toBeCalled();
      });
    });
  });
});

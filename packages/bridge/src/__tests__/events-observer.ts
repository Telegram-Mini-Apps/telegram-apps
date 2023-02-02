import {expect, it, describe, jest, beforeEach} from '@jest/globals';
import {createEventsObserver} from '../events-observer';

describe('events-observer.ts', () => {
  describe('createEventsObserver', () => {
    describe('returned event emitter', () => {
      let listeners: Record<string, ((...args: any) => any)[]>;
      let dispatchEvent: (event: string, ...args: any[]) => void;
      let addEventListener: (event: string, cb: (...args: any) => any) => void;

      beforeEach(() => {
        listeners = {};
        dispatchEvent = (event, ...args) => {
          const cbs = listeners[event] || [];
          cbs.forEach(cb => cb(...args));
        };
        addEventListener = (event, cb) => {
          if (listeners[event] === undefined) {
            listeners[event] = [];
          }
          listeners[event].push(cb);
        };
      });

      it('should emit "message" event with arguments eventType and ' +
        'eventData taken event.data property', () => {
        const eventType = 'custom_type';
        const eventData = 'custom_data';
        const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
          dispatchEvent,
          addEventListener,
        }) as any);

        const emitter = createEventsObserver();
        const spy = jest.spyOn(emitter, 'emit');

        dispatchEvent('message', {data: JSON.stringify({eventType, eventData})});

        expect(spy).toHaveBeenCalledWith('message', eventType, eventData);

        windowSpy.mockRestore();
      });

      it('should emit "message" event with arguments eventType and ' +
        'eventData taken event.data property in case, it contains incorrect ' +
        'message event data', () => {
        const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
          dispatchEvent,
          addEventListener,
        }) as any);

        const emitter = createEventsObserver();
        const spy = jest.spyOn(emitter, 'emit');

        dispatchEvent('message', {data: 'abc'});

        expect(spy).not.toHaveBeenCalled();

        windowSpy.mockRestore();
      });

      it('should emit "message" event with arguments ' +
        '"viewport_changed" and viewport changed payload in case, ' +
        'window changed its size', () => {
        const innerWidth = 100;
        const innerHeight = 100;
        const windowSpy = jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
          innerWidth,
          innerHeight,
          dispatchEvent,
          addEventListener,
        }) as any);

        const emitter = createEventsObserver();
        const spy = jest.spyOn(emitter, 'emit');

        dispatchEvent('resize');
        expect(spy).toHaveBeenCalledWith('message', 'viewport_changed', {
          width: innerWidth,
          height: innerHeight,
          is_state_stable: true,
          is_expanded: true,
        });

        windowSpy.mockRestore();
      });
    });
  });
});
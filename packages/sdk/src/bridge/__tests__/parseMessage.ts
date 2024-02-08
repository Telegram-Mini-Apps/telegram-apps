import { it, expect } from 'vitest';

import { parseMessage } from '../parseMessage';

it('should parse value as JSON with properties { eventType: string; eventData?: unknown }', () => {
  expect(parseMessage({ eventType: 1 })).toEqual({ eventType: '1' });
  expect(parseMessage({ eventType: 'test' })).toEqual({ eventType: 'test' });
  expect(parseMessage({ eventType: 'test', eventData: 123 })).toEqual({
    eventType: 'test',
    eventData: 123,
  });

  expect(parseMessage('{"eventType":1}')).toEqual({ eventType: '1' });
  expect(parseMessage('{"eventType":"test"}')).toEqual({ eventType: 'test' });
  expect(parseMessage('{"eventType":"test","eventData":123}')).toEqual({
    eventType: 'test',
    eventData: 123,
  });
});

it('should throw if eventType property is missing', () => {
  expect(() => parseMessage({})).toThrow();
});
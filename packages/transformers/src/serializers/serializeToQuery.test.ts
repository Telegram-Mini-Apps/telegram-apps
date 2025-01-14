import { it, expect } from 'vitest';
import { serializeToQuery } from '@/serializers/serializeToQuery.js';

it('should convert boolean to 1 or 0', () => {
  expect(serializeToQuery({ v: false })).toBe('v=0');
  expect(serializeToQuery({ v: true })).toBe('v=1');
});

it('should apply String to values of Array', () => {
  expect(serializeToQuery({ v: ['a', 'b', 1] })).toBe('v=a&v=b&v=1');
});

it('should omit null and undefined values empty', () => {
  expect(serializeToQuery({ a: null, b: undefined })).toBe('');
});

it('should convert Date to unix time', () => {
  expect(serializeToQuery({ a: new Date(2000) })).toBe('a=2');
});

it('should call JSON.stringify if value is object and onObject arg is not passed', () => {
  expect(serializeToQuery({ a: { b: 1 } })).toBe('a=%7B%22b%22%3A1%7D');
});

it('should call onObject if value is object and onObject arg is passed', () => {
  expect(
    serializeToQuery({ a: { b: 1 } }, (k, v) => `${k.length + 100}${JSON.stringify(v)}`),
  ).toBe('a=101%7B%22b%22%3A1%7D');
});

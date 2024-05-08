import { expect, it } from 'vitest';
import { getPathname } from '@/navigation/getPathname.js';

it('should convert passed value to the URL and take its pathname part', () => {
  expect(getPathname('pathname')).toBe('/pathname');
  expect(getPathname('/pathname')).toBe('/pathname');
  expect(getPathname('/pathname/a/b/c')).toBe('/pathname/a/b/c');
  expect(getPathname('http://example.com/pathname')).toBe('/pathname');
  expect(getPathname('/pathname#hash')).toBe('/pathname');
  expect(getPathname('/pathname?query')).toBe('/pathname');
  expect(getPathname({ pathname: '/pathname' })).toBe('/pathname');
  expect(getPathname({ pathname: 'pathname' })).toBe('/pathname');
});
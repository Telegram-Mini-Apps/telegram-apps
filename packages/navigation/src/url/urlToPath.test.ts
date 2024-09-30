import { expect, it } from 'vitest';

import { urlToPath } from './urlToPath.js';

it('should preserve trailing slash in the beginning of the path', () => {
  expect(urlToPath('a?b#c')).toBe('a?b#c');
  expect(urlToPath('/a?b#c')).toBe('/a?b#c');
  expect(urlToPath({ pathname: 'a', search: 'b', hash: 'c' })).toBe('a?b#c');
  expect(urlToPath({ pathname: '/a', search: 'b', hash: 'c' })).toBe('/a?b#c');
});
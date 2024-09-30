import { expect, it } from 'vitest';

import { ensurePrefix } from './ensurePrefix.js';

it('should prepend the second argument to the first one if it does not start with it', () => {
  expect(ensurePrefix('value', '/')).toBe('/value');
  expect(ensurePrefix('/value', '/')).toBe('/value');
  expect(ensurePrefix('value', '/complex/')).toBe('/complex/value');
});

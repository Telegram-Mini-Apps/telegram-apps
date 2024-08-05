import { expect, it } from 'vitest';

import { go } from './go.js';

// TODO: Add more tests.

it('should return true if delta is 0', () => {
  expect(go(0)).resolves.toBe(true);
});

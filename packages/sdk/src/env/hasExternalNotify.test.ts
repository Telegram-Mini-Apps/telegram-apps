import { expect, it } from 'vitest';

import { hasExternalNotify } from './hasExternalNotify.js';

it('should return true if passed object contains path property "external.notify" and "notify" is a function property.', () => {
  expect(hasExternalNotify({})).toBe(false);
  expect(hasExternalNotify({ external: {} })).toBe(false);
  expect(hasExternalNotify({ external: { notify: [] } })).toBe(false);
  expect(hasExternalNotify({
    external: {
      notify: () => {
      },
    },
  })).toBe(true);
});

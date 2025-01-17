import { expect, it } from 'vitest';

import { targetOrigin } from './targetOrigin.js';

it('should have initial value "https://web.telegram.org"', () => {
  expect(targetOrigin()).toBe('https://web.telegram.org');
});

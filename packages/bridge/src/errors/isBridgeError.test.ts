import { expect, it } from 'vitest';

import { isBridgeError } from './isBridgeError.js';
import { BridgeError } from './BridgeError.js';

it('should return true if passed value is instance of BridgeError', () => {
  expect(isBridgeError('')).toBe(false);
  expect(isBridgeError(new Error())).toBe(false);
  expect(isBridgeError(new BridgeError('ERR_METHOD_UNSUPPORTED'))).toBe(true);
});

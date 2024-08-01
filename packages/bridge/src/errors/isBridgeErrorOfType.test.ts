import { expect, it } from 'vitest';

import { isBridgeErrorOfType } from './isBridgeErrorOfType.js';
import { BridgeError } from './BridgeError.js';

it('should return true if passed value is instance of BridgeError', () => {
  expect(isBridgeErrorOfType('', 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isBridgeErrorOfType(new Error(), 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isBridgeErrorOfType(new BridgeError('ERR_METHOD_UNSUPPORTED'), 'ERR_METHOD_UNSUPPORTED')).toBe(true);
});

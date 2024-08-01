import { expect, it } from 'vitest';

import { isSDKError } from './isSDKError.js';
import { SDKError } from './SDKError.js';

it('should return true if passed value is instance of SDKError', () => {
  expect(isSDKError('')).toBe(false);
  expect(isSDKError(new Error())).toBe(false);
  expect(isSDKError(new SDKError('ERR_METHOD_UNSUPPORTED'))).toBe(true);
});

import { expect, it } from 'vitest';

import { isSDKErrorOfType } from './isSDKErrorOfType.js';
import { SDKError } from './SDKError.js';

it('should return true if passed value is instance of SDKError', () => {
  expect(isSDKErrorOfType('', 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isSDKErrorOfType(new Error(), 'ERR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isSDKErrorOfType(new SDKError('ERR_METHOD_UNSUPPORTED'), 'ERR_METHOD_UNSUPPORTED')).toBe(true);
});

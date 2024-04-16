import { expect, it } from 'vitest';

import { isSDKErrorOfType } from './isSDKErrorOfType.js';
import { SDKError } from './SDKError.js';

it('should return true if passed value is instance of SDKError', () => {
  expect(isSDKErrorOfType('', 'ERROR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isSDKErrorOfType(new Error(), 'ERROR_METHOD_UNSUPPORTED')).toBe(false);
  expect(isSDKErrorOfType(new SDKError('ERROR_METHOD_UNSUPPORTED'), 'ERROR_METHOD_UNSUPPORTED')).toBe(true);
});

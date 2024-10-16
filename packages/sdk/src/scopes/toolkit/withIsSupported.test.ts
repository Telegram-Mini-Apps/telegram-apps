import { it, describe, expect, beforeEach } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { withIsSupported } from '@/scopes/toolkit/withIsSupported.js';
import { $version } from '@/scopes/globals.js';
import { resetPackageState } from '@test-utils/reset/reset.js';

beforeEach(() => {
  resetPackageState();
});

describe('isSupported', () => {
  it('should return true if mini apps method is supported', () => {
    const fn = withIsSupported(() => {
    }, 'web_app_set_background_color');
    $version.set('6');
    expect(fn.isSupported()).toBe(false);

    $version.set('10');
    expect(fn.isSupported()).toBe(true);
  });
});

describe('returned function', () => {
  it('should throw if mini apps method is not supported', () => {
    const fn = withIsSupported(() => {
    }, 'web_app_set_background_color');
    $version.set('6');
    expect(fn).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    $version.set('10');
    expect(fn).not.toThrow();
  });

  it('should throw if isSupported function returned false', () => {
    let supported = false;
    const fn = withIsSupported(() => null, () => supported);
    expect(fn).toThrow(new TypedError('ERR_NOT_SUPPORTED'));

    supported = true;
    expect(fn).not.toThrow();
  });
});

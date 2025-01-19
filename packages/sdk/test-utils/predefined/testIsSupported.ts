import { expect, it } from 'vitest';

import { _version } from '@/globals.js';

export function testIsSupported(
  fnOrObj: (() => boolean) | {
    isSupported(): boolean;
  },
  minVersion: string,
) {
  it(`should return false if version is less than ${minVersion}`, () => {
    const fn = typeof fnOrObj === 'object'
      ? fnOrObj.isSupported
      : fnOrObj;
    const [a, b = 0] = minVersion.split('.').map(Number);
    const prevVersion = `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`;

    _version.set(prevVersion);
    expect(fn()).toBe(false);

    _version.set(minVersion);
    expect(fn()).toBe(true);
  });
}

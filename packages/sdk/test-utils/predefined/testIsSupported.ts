import { expect, it } from 'vitest';

import { $version } from '@/scopes/globals.js';

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

    $version.set(prevVersion);
    expect(fn()).toBe(false);

    $version.set(minVersion);
    expect(fn()).toBe(true);
  });
}

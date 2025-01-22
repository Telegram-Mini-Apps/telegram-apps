import { expect, it } from 'vitest';

import { setVersion } from '@test-utils/utils.js';

export function testIsSupported(
  fnOrObj: (() => boolean) | {
    isSupported(): boolean;
  },
  minVersion?: string,
) {
  if (minVersion) {
    it(`should return false if version is less than ${minVersion}`, () => {
      const fn = typeof fnOrObj === 'object'
        ? fnOrObj.isSupported
        : fnOrObj;
      const [a, b = 0] = minVersion.split('.').map(Number);
      const prevVersion = `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`;

      setVersion(prevVersion);
      expect(fn()).toBe(false);

      setVersion(minVersion);
      expect(fn()).toBe(true);
    });
  }
}

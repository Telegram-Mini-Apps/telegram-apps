import type { Version } from '@telegram-apps/types';

function parts(a: Version): number[] {
  return a.split('.').map(v => parseInt(v, 10));
}

/**
 * @param a - first version.
 * @param b - second version.
 * @returns
 * - `1` if the version "a" is greater than "b".
 * - `0` the version "a" is equal to "b".
 * - `-1` the version "a" is lower than "b".
 */
export function compareVersions(a: Version, b: Version): number {
  const aParts = parts(a);
  const bParts = parts(b);
  const len = Math.max(aParts.length, bParts.length);

  // Iterate over each part of versions and compare them. In case, part is
  // missing, assume its value is equal to 0.
  for (let i = 0; i < len; i += 1) {
    const aVal = aParts[i]
    const bVal = bParts[i];

    if (aVal === bVal) {
      continue;
    }
    return aVal > bVal ? 1 : -1;
  }
  return 0;
}

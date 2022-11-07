/**
 * Web App version in format like "\d+.\d+".
 */
export type Version = string;

/**
 * Returns 1 in case, version "a" is greater than "b".
 * Returns 0 in case, version "a" equal to "b".
 * Returns -1 in case, version "a" is lower than "b".
 *
 * @param a - first version.
 * @param b - second version.
 */
export function compareVersions(a: Version, b: Version): number {
  // Split both of the version by dot.
  const aParts = a.split('.');
  const bParts = b.split('.');

  // Compute maximum length.
  const len = Math.max(aParts.length, bParts.length);

  // Iterate over each part of version and compare them. In case, part is
  // missing, assume its value is equal to 0.
  for (let i = 0; i < len; i++) {
    const aVal = parseInt(aParts[i] || '0');
    const bVal = parseInt(bParts[i] || '0');

    if (aVal === bVal) {
      continue;
    }
    return aVal > bVal ? 1 : -1;
  }
  return 0;
}

/**
 * Throws an error in case, "checkedVersion" is lower than "minVersion".
 *
 * @param minVersion - minimal version.
 * @param checkedVersion - checked version.
 */
export function requireVersion(minVersion: Version, checkedVersion: Version) {
  if (compareVersions(checkedVersion, minVersion) === -1) {
    throw new Error(
      `Version "${checkedVersion}" does not satisfy minimal required version "${minVersion}"`,
    );
  }
}

import { it, expect } from 'vitest';

export function testIsSupported(
  get: (version: string) => { isSupported(): boolean },
  minVersion: string,
) {
  const [a, b = 0] = minVersion.split('.').map(Number);
  const prevVersion = `${b === 0 ? a - 1 : a}.${b === 0 ? 99 : b - 1}`;

  it(`should return false if version is less than ${minVersion}`, () => {
    expect(get(prevVersion).isSupported()).toBe(false);
    expect(get(minVersion).isSupported()).toBe(true);
  });
}
import { expect, it } from 'vitest';
import { isStableViewportPlatform } from '~/viewport/index.js';

for (const platform of ['macos', 'tdesktop', 'unigram', 'web', 'weba']) {
  it(`should return true if passed platform is "${platform}"`, () => {
    expect(isStableViewportPlatform(platform)).toBe(true);
  });
}

for (const platform of ['unknown', 'android', 'android_x']) {
  it(`should return false if passed platform is "${platform}"`, () => {
    expect(isStableViewportPlatform(platform)).toBe(false);
  });
}

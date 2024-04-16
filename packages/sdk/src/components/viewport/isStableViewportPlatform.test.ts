import { expect, it } from 'vitest';

import { isStableViewportPlatform } from './isStableViewportPlatform.js';

['macos', 'tdesktop', 'unigram', 'webk', 'weba'].forEach((platform) => {
  it(`should return true if passed platform is "${platform}"`, () => {
    expect(isStableViewportPlatform(platform)).toBe(true);
  });
});

['unknown', 'android', 'android_x'].forEach((platform) => {
  it(`should return false if passed platform is "${platform}"`, () => {
    expect(isStableViewportPlatform(platform)).toBe(false);
  });
});

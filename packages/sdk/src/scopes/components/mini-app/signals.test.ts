import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resetPackageState } from '@test-utils/utils.js';

import { _state as tpState } from '@/scopes/components/theme-params/signals.js';

import {
  _headerColor,
  _backgroundColor,
  bottomBarColorRGB,
  backgroundColorRGB,
  headerColorRGB,
  _bottomBarColor,
} from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
});

describe('bottomBarColorRGB', () => {
  it('should return value of bottomBarColor signal if it is RGB', () => {
    _bottomBarColor.set('#ffaabb');
    expect(bottomBarColorRGB()).toBe('#ffaabb');
  });

  describe('bottomBarColor signal value is "bottom_bar_bg_color"', () => {
    beforeEach(() => {
      _bottomBarColor.set('bottom_bar_bg_color');
    });

    it('should return value of theme\'s bottom_bar_bg_color property if it exists', () => {
      tpState.set({ bottom_bar_bg_color: '#abcdef' });
      expect(bottomBarColorRGB()).toBe('#abcdef');
    });

    it('should return value of theme\'s secondaryBgColor property if it exists', () => {
      tpState.set({ secondary_bg_color: '#ddffea' });
      expect(bottomBarColorRGB()).toBe('#ddffea');
    });

    it('should return undefined if bottomBarBgColor and secondaryBgColor keys are not presented in theme', () => {
      tpState.set({});
      expect(bottomBarColorRGB()).toBeUndefined();
    });
  });

  it.each([
    { value: 'bg_color', source: 'bg_color' },
    { value: 'secondary_bg_color', source: 'secondary_bg_color' },
  ] as const)('should return value of theme\'s $source property if headerColor signal value is $value', ({
    value,
    source,
  }) => {
    tpState.set({ bg_color: '#ffffff', secondary_bg_color: '#000000' });
    _headerColor.set(value);
    expect(headerColorRGB()).toBe(tpState()[source]);
  });
});

describe('backgroundColorRGB', () => {
  it('should return value of backgroundColor signal if it is RGB', () => {
    _backgroundColor.set('#ffaabb');
    expect(backgroundColorRGB()).toBe('#ffaabb');
  });

  it.each([
    { value: 'bg_color', source: 'bg_color' },
    { value: 'secondary_bg_color', source: 'secondary_bg_color' },
  ] as const)('should return value of theme\'s $source property if backgroundColor signal value is $value', ({
    value,
    source,
  }) => {
    tpState.set({ bg_color: '#ffffff', secondary_bg_color: '#000000' });
    _backgroundColor.set(value);
    expect(backgroundColorRGB()).toBe(tpState()[source]);
  });
});

describe('headerColorRGB', () => {
  it('should return value of headerColor signal if it is RGB', () => {
    _headerColor.set('#ffaabb');
    expect(headerColorRGB()).toBe('#ffaabb');
  });

  it.each([
    { value: 'bg_color', source: 'bg_color' },
    { value: 'secondary_bg_color', source: 'secondary_bg_color' },
  ] as const)('should return value of theme\'s $source property if headerColor signal value is $value', ({
    value,
    source,
  }) => {
    tpState.set({ bg_color: '#ffffff', secondary_bg_color: '#000000' });
    _headerColor.set(value);
    expect(headerColorRGB()).toBe(tpState()[source]);
  });
});
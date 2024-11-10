import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { $version } from '@/scopes/globals.js';
import { state as tpState } from '@/scopes/components/theme-params/signals.js';

import {
  mount,
  ready,
  setBackgroundColor,
  setBottomBarColor,
  setHeaderColor,
  isSupported,
  close,
  bindCssVars,
} from './methods.js';
import {
  backgroundColor,
  bottomBarColor,
  isMounted,
  headerColor,
} from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  isMounted.set(true);
}

describe.each([
  ['mount', mount, {}],
  ['ready', ready, {}],
  ['setBackgroundColor', setBackgroundColor, { isMounted }],
  ['setBottomBarColor', setBottomBarColor, { isMounted, minVersion: '7.10' }],
  ['setHeaderColor', setHeaderColor, {}],
  ['close', close, {}],
  ['bindCssVars', bindCssVars, { isMounted }],
] as const)('%s', (name, fn, options) => {
  testSafety(fn, name, {
    component: 'miniApp',
    minVersion: '6.1',
    ...options,
  });
});

describe('bindCssVars', () => {
  type SetPropertyFn = typeof document.documentElement.style.setProperty;
  let setSpy: MockInstance<SetPropertyFn>;

  beforeEach(() => {
    setMaxVersion();
    mockMiniAppsEnv();
    mount();
    setSpy = vi
      .spyOn(document.documentElement.style, 'setProperty')
      .mockImplementation(() => null);
  });

  describe('background color', () => {
    it('should set --tg-bg-color == backgroundColorRGB()', () => {
      backgroundColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#fedcba');
    });

    it('should set --tg-bg-color == backgroundColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      backgroundColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#ddddaa');

      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      backgroundColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#aafedd');

      setSpy.mockClear();
      backgroundColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', null);
    });
  });

  describe('header color', () => {
    it('should set --tg-header-color == headerColorRGB()', () => {
      headerColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#fedcba');
    });

    it('should set --tg-header-color == headerColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      headerColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#ddddaa');

      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      headerColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#aafedd');

      setSpy.mockClear();
      headerColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', null);
    });
  });

  describe('bottom bar color', () => {
    it('should set --tg-bottom-bar-color == bottomBarColorRGB()', () => {
      bottomBarColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#fedcba');
    });

    it('should set --tg-bottom-bar-color == bottomBarColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      bottomBarColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#aafedd');

      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      bottomBarColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddddaa');

      tpState.set({ bottomBarBgColor: '#ddaacc' });
      setSpy.mockClear();
      bottomBarColor.set('bottom_bar_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddaacc');

      setSpy.mockClear();
      bottomBarColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', null);
    });
  });
});

describe('close', () => {
  beforeEach(setAvailable);

  it('should call "web_app_close" with "return_back" option', () => {
    const spy = mockPostEvent();
    close(false);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_close', { return_back: false });
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '6.1');
});

describe('ready', () => {
  beforeEach(setAvailable);

  it('should call "web_app_ready"', () => {
    const spy = mockPostEvent();
    ready();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_ready', undefined);
  });
});


describe('setBackgroundColor', () => {
  beforeEach(setAvailable);

  it('should call postEvent with "web_app_set_background_color"', () => {
    const spy = mockPostEvent();
    setBackgroundColor('secondary_bg_color');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_set_background_color', { color: 'secondary_bg_color' });
  });
});

describe('setBottomBarColor', () => {
  beforeEach(setAvailable);

  describe('isSupported', () => {
    it('should return false if version is less than 7.10. True otherwise', () => {
      $version.set('7.9');
      expect(setBottomBarColor.isSupported()).toBe(false);

      $version.set('7.10');
      expect(setBottomBarColor.isSupported()).toBe(true);

      $version.set('7.11');
      expect(setBottomBarColor.isSupported()).toBe(true);
    });
  });
});

describe('setHeaderColor', () => {
  beforeEach(setAvailable);

  it('should call postEvent with "web_app_set_header_color"', () => {
    const spy = mockPostEvent();
    setHeaderColor('secondary_bg_color');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
  });

  it('should throw ERR_NOT_SUPPORTED if rgb is used and version is less than 6.9', () => {
    $version.set('6.8');
    expect(() => setHeaderColor('#ffaaaa')).toThrow(
      new TypedError(
        'ERR_NOT_SUPPORTED',
        'Unable to call the miniApp.setHeaderColor() method: option rgb is not supported in Mini Apps version 6.8',
      ),
    );

    $version.set('6.9');
    expect(() => setHeaderColor('#ffaaaa')).not.toThrow();
  });

  describe('supports', () => {
    describe('rgb', () => {
      it('should return false if version is less than 6.9', () => {
        $version.set('6.8');
        expect(setHeaderColor.supports.rgb()).toBe(false);

        $version.set('6.9');
        expect(setHeaderColor.supports.rgb()).toBe(true);
      });
    });
  });
});

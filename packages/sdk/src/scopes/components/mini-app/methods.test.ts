import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { setVersion } from '@test-utils/utils.js';

import { _state as tpState } from '@/scopes/components/theme-params/signals.js';

import {
  mount,
  ready,
  setBackgroundColor,
  setBottomBarColor,
  setHeaderColor,
  isSupported,
  close,
  bindCssVars,
  _isMounted,
} from './methods.js';
import {
  _backgroundColor,
  _bottomBarColor,
  _headerColor,
} from './signals.js';
import { FunctionUnavailableError } from '@/errors.js';
import { setStorageValue } from '@telegram-apps/toolkit';
import { mockPageReload } from 'test-utils';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  _isMounted.set(true);
}

describe.each([
  ['mount', mount, {}],
  ['ready', ready, {}],
  ['setBackgroundColor', setBackgroundColor, { isMounted: _isMounted }],
  ['setBottomBarColor', setBottomBarColor, { isMounted: _isMounted, minVersion: '7.10' }],
  ['setHeaderColor', setHeaderColor, {}],
  ['close', close, {}],
  ['bindCssVars', bindCssVars, { isMounted: _isMounted }],
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

  beforeEach(async () => {
    setMaxVersion();
    setStorageValue('themeParams', {
      bg_color: '#ffffff',
      secondary_bg_color: '#000000',
    });
    mockPageReload();
    mockMiniAppsEnv();
    setSpy = vi
      .spyOn(document.documentElement.style, 'setProperty')
      .mockImplementation(() => null);

    await mount();
  });

  describe('background color', () => {
    it('should set --tg-bg-color == backgroundColorRGB()', () => {
      _backgroundColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#fedcba');
    });

    it('should set --tg-bg-color == backgroundColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      _backgroundColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#ddddaa');

      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      _backgroundColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', '#aafedd');

      setSpy.mockClear();
      _backgroundColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bg-color', null);
    });
  });

  describe('header color', () => {
    it('should set --tg-header-color == headerColorRGB()', () => {
      _headerColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#fedcba');
    });

    it('should set --tg-header-color == headerColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      _headerColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#ddddaa');

      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      _headerColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', '#aafedd');

      setSpy.mockClear();
      _headerColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-header-color', null);
    });
  });

  describe('bottom bar color', () => {
    it('should set --tg-bottom-bar-color == bottomBarColorRGB()', () => {
      _bottomBarColor.set('#fedcba');
      bindCssVars();
      expect(setSpy).toHaveBeenCalledTimes(3);
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#fedcba');
    });

    it('should set --tg-bottom-bar-color == bottomBarColorRGB() when theme changes', () => {
      bindCssVars();
      tpState.set({ bgColor: '#aafedd' });
      setSpy.mockClear();
      _bottomBarColor.set('bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#aafedd');

      tpState.set({ secondaryBgColor: '#ddddaa' });
      setSpy.mockClear();
      _bottomBarColor.set('secondary_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddddaa');

      tpState.set({ bottomBarBgColor: '#ddaacc' });
      setSpy.mockClear();
      _bottomBarColor.set('bottom_bar_bg_color');
      expect(setSpy).toHaveBeenCalledOnce();
      expect(setSpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddaacc');

      setSpy.mockClear();
      _bottomBarColor.set('bg_color');
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
      setVersion('7.9');
      expect(setBottomBarColor.isSupported()).toBe(false);

      setVersion('7.10');
      expect(setBottomBarColor.isSupported()).toBe(true);

      setVersion('7.11');
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

  it('should throw FunctionUnavailableError if rgb is used and version is less than 6.9', () => {
    setVersion('6.8');
    expect(() => setHeaderColor('#ffaaaa')).toThrow(
      new FunctionUnavailableError(
        'Unable to call the miniApp.setHeaderColor() method: option rgb is not supported in Mini Apps version 6.8',
      ),
    );

    setVersion('6.9');
    expect(() => setHeaderColor('#ffaaaa')).not.toThrow();
  });

  describe('supports', () => {
    describe('rgb', () => {
      it('should return false if version is less than 6.9', () => {
        setVersion('6.8');
        expect(setHeaderColor.supports.rgb()).toBe(false);

        setVersion('6.9');
        expect(setHeaderColor.supports.rgb()).toBe(true);
      });
    });
  });
});

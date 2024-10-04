import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { createWindow } from 'test-utils';
import type { ThemeParams } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { state as tpState } from '@/scopes/components/theme-params/signals.js';
import { $version } from '@/scopes/globals.js';

import { headerColor, backgroundColor, bottomBarColor } from './signals.js';
import {
  bindCssVars,
  close,
  mount,
  ready,
  setBackgroundColor,
  setBottomBarColor,
  setHeaderColor,
} from './methods.js';

type SetPropertyFn = typeof document.documentElement.style.setProperty;
let setPropertySpy: MockInstance<SetPropertyFn>;

vi.mock('@telegram-apps/bridge', async () => {
  const m = await vi.importActual('@telegram-apps/bridge');
  return {
    ...m,
    retrieveLaunchParams: vi.fn(() => ({
      themeParams: {
        bgColor: '#ffcccc',
        secondaryBgColor: '#ccccff',
      } satisfies ThemeParams,
    })),
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  createWindow();
  setPropertySpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
  mockPostEvent();
});

describe('bindCssVars', () => {
  describe('background color', () => {
    it('should set --tg-bg-color == backgroundColorRGB()', () => {
      backgroundColor.set('#fedcba');
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(3);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#fedcba');
    });
  });

  describe('header color', () => {
    it('should set --tg-header-color == headerColorRGB()', () => {
      headerColor.set('#fedcba');
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(3);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#fedcba');
    });
  });

  describe('bottom bar color', () => {
    it('should set --tg-bottom-bar-color == bottomBarColorRGB()', () => {
      bottomBarColor.set('#fedcba');
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(3);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#fedcba');
    });
  });

  describe('mounted', () => {
    beforeEach(mount);

    describe('background color', () => {
      it('should set --tg-bg-color == backgroundColorRGB() when theme changes', () => {
        bindCssVars();
        tpState.set({ secondaryBgColor: '#ddddaa' });
        setPropertySpy.mockClear();
        backgroundColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#ddddaa');

        tpState.set({ bgColor: '#aafedd' });
        setPropertySpy.mockClear();
        backgroundColor.set('bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#aafedd');

        setPropertySpy.mockClear();
        backgroundColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', null);
      });
    });

    describe('header color', () => {
      it('should set --tg-header-color == headerColorRGB() when theme changes', () => {
        bindCssVars();
        tpState.set({ secondaryBgColor: '#ddddaa' });
        setPropertySpy.mockClear();
        headerColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#ddddaa');

        tpState.set({ bgColor: '#aafedd' });
        setPropertySpy.mockClear();
        headerColor.set('bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#aafedd');

        setPropertySpy.mockClear();
        headerColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', null);
      });
    });

    describe('bottom bar color', () => {
      it('should set --tg-bottom-bar-color == bottomBarColorRGB() when theme changes', () => {
        bindCssVars();
        tpState.set({ bgColor: '#aafedd' });
        setPropertySpy.mockClear();
        bottomBarColor.set('bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#aafedd');

        tpState.set({ secondaryBgColor: '#ddddaa' });
        setPropertySpy.mockClear();
        bottomBarColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddddaa');

        tpState.set({ bottomBarBgColor: '#ddaacc' });
        setPropertySpy.mockClear();
        bottomBarColor.set('bottom_bar_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bottom-bar-color', '#ddaacc');

        setPropertySpy.mockClear();
        bottomBarColor.set('bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bottom-bar-color', null);
      });
    });
  });
});

describe('mounted', () => {
  beforeEach(mount);

  describe('setBackgroundColor', () => {
    it('should call "web_app_set_background_color" method with { color: {{color}} }', () => {
      const spy = mockPostEvent();
      expect(spy).toHaveBeenCalledTimes(0);
      setBackgroundColor('#abcdef');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_set_background_color', { color: '#abcdef' });
    });
  });

  describe('setBottomBarColor', () => {
    it('should call "web_app_set_bottom_bar_color" method with { color: {{color}} }', () => {
      const spy = mockPostEvent();
      expect(spy).toHaveBeenCalledTimes(0);
      setBottomBarColor('#abcdef');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_set_bottom_bar_color', { color: '#abcdef' });
    });
  });

  describe('setHeaderColor', () => {
    it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
      const spy = mockPostEvent();
      expect(spy).toHaveBeenCalledTimes(0);
      setHeaderColor('secondary_bg_color');
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
    });
  });
});

describe('mount', () => {
  it('should call postEvent with "web_app_set_background_color"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, 'web_app_set_background_color', { color: 'bg_color' });
  });

  it('should call postEvent with "web_app_set_bottom_bar_color"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(2, 'web_app_set_bottom_bar_color', { color: 'bottom_bar_bg_color' });
  });

  it('should call postEvent with "web_app_set_header_color"', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(3, 'web_app_set_header_color', { color_key: 'bg_color' });
  });
});

describe('close', () => {
  it('should call "web_app_close" with "return_back" option', () => {
    const spy = mockPostEvent();
    close(false);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_close', { return_back: false });
  });
});

describe('ready', () => {
  it('should call "web_app_ready"', () => {
    const spy = mockPostEvent();
    ready();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_ready', undefined);
  });
});

describe('setBackgroundColor', () => {
  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      $version.set('6.0');
      expect(setBackgroundColor.isSupported()).toBe(false);

      $version.set('6.1');
      expect(setBackgroundColor.isSupported()).toBe(true);

      $version.set('6.2');
      expect(setBackgroundColor.isSupported()).toBe(true);
    });
  });
});

describe('setBottomBarColor', () => {
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
  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      $version.set('6.0');
      expect(setHeaderColor.isSupported()).toBe(false);

      $version.set('6.1');
      expect(setHeaderColor.isSupported()).toBe(true);

      $version.set('6.2');
      expect(setHeaderColor.isSupported()).toBe(true);
    });
  });

  describe('supports "color"', () => {
    it('should return false if version is less than 6.9. True otherwise', () => {
      $version.set('6.8');
      expect(setHeaderColor.supports('color')).toBe(false);

      $version.set('6.9');
      expect(setHeaderColor.supports('color')).toBe(true);

      $version.set('6.10');
      expect(setHeaderColor.supports('color')).toBe(true);
    });
  });
});

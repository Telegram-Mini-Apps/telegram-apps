import { beforeEach, describe, expect, it, Mock, MockInstance, vi } from 'vitest';
import { createWindow } from 'test-utils';

import { resetPackageState, resetSignal } from '@test-utils/reset.js';
import { $postEvent } from '@/scopes/globals/globals.js';
import * as themeParams from '@/scopes/theme-params/instance.js';

import {
  headerColor,
  backgroundColor,
  state,
  isMounted,
  isDark,
  isCssVarsBound,
} from './signals.js';
import { bindCssVars, mount, setBackgroundColor, setHeaderColor } from './methods.js';

type SetPropertyFn = typeof document.documentElement.style.setProperty;
let setPropertySpy: MockInstance<Parameters<SetPropertyFn>, ReturnType<SetPropertyFn>>;

vi.mock('@/scopes/launch-params/static.js', () => ({
  retrieve: () => ({
    themeParams: {
      bgColor: '#ffcccc',
      secondaryBgColor: '#ccccff',
    },
  }),
}));

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  [
    themeParams.isCssVarsBound,
    themeParams.isMounted,
    themeParams.state,
    headerColor,
    backgroundColor,
    state,
    isMounted,
    isDark,
    isCssVarsBound,
  ].forEach(resetSignal);

  createWindow();
  setPropertySpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
  $postEvent.set(() => null);
});

describe('bindCssVars', () => {
  describe('backgroundColor', () => {
    it('should set --tg-bg-color == backgroundColor()', () => {
      backgroundColor.set('#abcdef');
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledOnce();
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#abcdef');
    });
  });

  describe('headerColor', () => {
    it('should set --tg-header-color == headerColor() if header color is RGB', () => {
      headerColor.set('#fedcba');
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(2);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#fedcba');
    });

    it('should set --tg-header-color equal to theme params bgColor if headerColor is bg_color', () => {
      headerColor.set('bg_color');
      themeParams.state.set({ bgColor: '#aaaaaa' });
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(2);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#aaaaaa');
    });

    it('should set --tg-header-color equal to theme params secondaryBgColor if headerColor is secondary_bg_color', () => {
      headerColor.set('secondary_bg_color');
      themeParams.state.set({ secondaryBgColor: '#dddddd' });
      bindCssVars();
      expect(setPropertySpy).toHaveBeenCalledTimes(2);
      expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#dddddd');
    });
  });

  describe('mounted', () => {
    beforeEach(mount);

    describe('backgroundColor', () => {
      it('should set --tg-bg-color == backgroundColor() when background color changed', () => {
        bindCssVars();
        setPropertySpy.mockClear();
        backgroundColor.set('#aaaaaa');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#aaaaaa');
      });
    });

    describe('headerColor', () => {
      it('should update --tg-header-color each time headerColor or related theme param changes', () => {
        bindCssVars();
        themeParams.state.set({
          bgColor: '#ffffff',
          secondaryBgColor: '#eeeeee',
        });
        setPropertySpy.mockClear();
        headerColor.set('secondary_bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#eeeeee');

        setPropertySpy.mockClear();
        headerColor.set('bg_color');
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#ffffff');

        setPropertySpy.mockClear();
        themeParams.state.set({
          bgColor: '#aaaaaa',
        });
        expect(setPropertySpy).toHaveBeenCalledOnce();
        expect(setPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#aaaaaa');
      });
    });

    let spy: Mock;

    beforeEach(() => {
      mount();
      spy = vi.fn();
      $postEvent.set(spy);
    });

    describe('setBackgroundColor', () => {
      it('should call "web_app_set_background_color" method with { color: {{color}} }', () => {
        expect(spy).toHaveBeenCalledTimes(0);
        setBackgroundColor('#abcdef');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('web_app_set_background_color', { color: '#abcdef' });
      });
    });

    describe('setHeaderColor', () => {
      it('should call "web_app_set_header_color" method with { color_key: {{color_key}} }', () => {
        expect(spy).toHaveBeenCalledTimes(0);
        setHeaderColor('secondary_bg_color');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('web_app_set_header_color', { color_key: 'secondary_bg_color' });
      });
    });
  });
});

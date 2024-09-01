import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { createWindow } from 'test-utils';
import { emitMiniAppsEvent } from '@telegram-apps/bridge';
import { resetSignal, resetPackageState } from '@test-utils/reset.js';

import { bindCssVars, mount } from './methods.js';
import { isCssVarsBound, isMounted, state } from './signals.js';

type SetPropertyFn = typeof document.documentElement.style.setProperty;
let setSpy: MockInstance<Parameters<SetPropertyFn>, ReturnType<SetPropertyFn>>;

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  [isCssVarsBound, isMounted, state].forEach(resetSignal);

  createWindow();
  setSpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
});

vi.mock('@/scopes/launch-params/static.js', () => ({
  retrieve: vi.fn(() => ({
    themeParams: {},
  })),
}));

describe('bindCssVars', () => {
  it('should set --tg-theme-{key} CSS vars, where key is kebab-cased theme keys', () => {
    state.set({
      bgColor: '#abcdef',
      accentTextColor: '#000011',
    });
    bindCssVars();
    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalledWith('--tg-theme-bg-color', '#abcdef');
    expect(setSpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#000011');
  });

  it('should update --tg-theme-{key} variables to the values, received in theme_changed event', () => {
    state.set({
      bgColor: '#abcdef',
      accentTextColor: '#000011',
    });
    bindCssVars();
    mount();

    setSpy.mockClear();
    emitMiniAppsEvent('theme_changed', {
      theme_params: {
        bg_color: '#111111',
        accent_text_color: '#222222',
        text_color: '#333333',
      },
    });

    expect(setSpy).toHaveBeenCalledTimes(3);
    expect(setSpy).toHaveBeenCalledWith('--tg-theme-bg-color', '#111111');
    expect(setSpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#222222');
    expect(setSpy).toHaveBeenCalledWith('--tg-theme-text-color', '#333333');
  });

  it('should set CSS variable using custom function', () => {
    state.set({
      bgColor: '#abcdef',
      accentTextColor: '#000011',
    });
    bindCssVars((property) => `--my-${property}`);

    expect(setSpy).toHaveBeenCalledTimes(2);
    expect(setSpy).toHaveBeenCalledWith('--my-bgColor', '#abcdef');
    expect(setSpy).toHaveBeenCalledWith('--my-accentTextColor', '#000011');
  });

  it('should stop updating variables, if returned function was called', () => {
    state.set({
      bgColor: '#abcdef',
      accentTextColor: '#000011',
    });
    const cleanup = bindCssVars();
    mount();

    setSpy.mockClear();
    emitMiniAppsEvent('theme_changed', {
      theme_params: {
        bg_color: '#111111',
        accent_text_color: '#222222',
        text_color: '#333333',
      },
    });

    expect(setSpy).toHaveBeenCalledTimes(3);

    cleanup();
    emitMiniAppsEvent('theme_changed', {
      theme_params: {
        bg_color: '#222222',
      },
    });
    expect(setSpy).toHaveBeenCalledTimes(3);
  });
});

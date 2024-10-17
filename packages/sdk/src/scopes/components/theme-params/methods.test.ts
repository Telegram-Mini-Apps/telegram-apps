import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { createWindow } from 'test-utils';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { mockPostEvent } from '@test-utils/mockPostEvent.js';

import { bindCssVars, mount } from './methods.js';
import { isMounted, state } from './signals.js';

type SetPropertyFn = typeof document.documentElement.style.setProperty;
let setSpy: MockInstance<SetPropertyFn>;

vi.mock('@telegram-apps/bridge', async () => {
  const m = await vi.importActual('@telegram-apps/bridge');
  return {
    ...m,
    retrieveLaunchParams: vi.fn(() => ({
      themeParams: {},
    })),
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  createWindow();
  mockPostEvent();
  setSpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
});

describe('bindCssVars', () => {
  beforeEach(mount);

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

describe('mount check', () => {
  it.each([
    { fn: bindCssVars, name: 'bindCssVars' },
  ])('$name function should throw ERR_NOT_MOUNTED if component was not mounted', ({ fn }) => {
    expect(fn).toThrow(new TypedError('ERR_NOT_MOUNTED'));
    isMounted.set(true);
    expect(fn).not.toThrow();
  });
});
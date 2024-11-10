import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { emitMiniAppsEvent, TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';

import { bindCssVars, mount } from './methods.js';
import { state } from './signals.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

describe.each([
  ['bindCssVars', bindCssVars],
  ['mount', mount],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the themeParams.${name}() method: it can't be called outside Mini Apps`,
    );
    expect(fn).toThrow(err);
    mockMiniAppsEnv();
    expect(fn).not.toThrow(err);
  });

  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    it('should throw ERR_UNKNOWN_ENV if called on the server', () => {
      mockSSR();
      expect(fn).toThrow(
        new TypedError(
          'ERR_UNKNOWN_ENV',
          `Unable to call the themeParams.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the themeParams.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });
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
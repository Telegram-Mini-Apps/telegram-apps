import { afterEach, beforeAll, beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { resetPackageState } from '@test-utils/resetPackageState.js';

import { bindCssVars } from './index.js';
import {isCssVarsBound, isMounted, state} from './signals.js';

afterEach(() => {
  resetPackageState();
  isCssVarsBound.reset();
  isMounted.reset();
  state.reset();
})

describe('bindCssVars', () => {
  type SetPropertyFn = typeof document.documentElement.style.setProperty;
  let setSpy: MockInstance<Parameters<SetPropertyFn>, ReturnType<SetPropertyFn>>;

  beforeAll(() => {
    setSpy = vi
      .spyOn(document.documentElement.style, 'setProperty')
      .mockImplementation(() => {
      });
  });

  beforeEach(() => {
    state.reset();
  });

  afterEach(() => {
    setSpy.mockClear();
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

  // todo
  // it(
  //   'should update --tg-theme-{key} variables to the values, received in the Theme change events',
  //   async () => {
  //     _.state.set({
  //       bgColor: '#abcdef',
  //       accentTextColor: '#000011',
  //     });
  //     bindCssVars();
  //     setSpy.mockClear();
  //
  //     tp.listen();
  //
  //     dispatchWindowMessageEvent('theme_changed', {
  //       theme_params: {
  //         bg_color: '#111111',
  //         accent_text_color: '#222222',
  //         text_color: '#333333',
  //       },
  //     });
  //
  //     expect(setSpy).toHaveBeenCalledTimes(3);
  //     expect(setSpy).toHaveBeenCalledWith('--tg-theme-bg-color', '#111111');
  //     expect(setSpy).toHaveBeenCalledWith('--tg-theme-accent-text-color', '#222222');
  //     expect(setSpy).toHaveBeenCalledWith('--tg-theme-text-color', '#333333');
  //   },
  // );

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

  // todo
  // it('should stop updating variables, if returned function was called', () => {
  //   const tp = new ThemeParams({
  //     bgColor: '#abcdef',
  //     accentTextColor: '#000011',
  //   });
  //   const cleanup = bindThemeParamsCSSVars(tp);
  //
  //   expect(setSpy).toHaveBeenCalledTimes(2);
  //   tp.listen();
  //   dispatchWindowMessageEvent('theme_changed', {
  //     theme_params: {
  //       bg_color: '#111111',
  //     },
  //   });
  //   expect(setSpy).toHaveBeenCalledTimes(4);
  //
  //   cleanup();
  //   dispatchWindowMessageEvent('theme_changed', {
  //     theme_params: {
  //       bg_color: '#222222',
  //     },
  //   });
  //   expect(setSpy).toHaveBeenCalledTimes(4);
  // });
});

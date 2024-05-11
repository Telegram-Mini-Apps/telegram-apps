import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { MiniApp } from '@/components/MiniApp/MiniApp.js';
import { ThemeParams } from '@/components/ThemeParams/ThemeParams.js';

import { bindMiniAppCSSVars } from './bindMiniAppCSSVars.js';

let setCSSPropertySpy: FnToSpy<typeof document.documentElement.style.setProperty>;

beforeAll(() => {
  setCSSPropertySpy = vi
    .spyOn(document.documentElement.style, 'setProperty')
    .mockImplementation(() => {
    });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('bgColor', () => {
  it('should set --tg-bg-color equal to miniApp.bgColor', () => {
    bindMiniAppCSSVars(
      new MiniApp({
        bgColor: '#111111',
        headerColor: '#222222',
        botInline: false,
        version: '7.0',
        postEvent: () => null,
        createRequestId: () => 'abc',
      }),
      new ThemeParams({}),
    );

    expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#111111');
  });

  it(
    'should update --tg-bg-color according to the changes applied to mini app background color',
    () => {
      const ma = new MiniApp({
        bgColor: '#111111',
        headerColor: '#222222',
        botInline: false,
        version: '7.0',
        postEvent: () => null,
        createRequestId: () => 'abc',
      });

      bindMiniAppCSSVars(ma, new ThemeParams({}));
      setCSSPropertySpy.mockClear();

      ma.setBgColor('#999999');
      expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-bg-color', '#999999');
    },
  );
});

describe('header', () => {
  it('should set --tg-header-color equal to miniApp.headerColor if this value is RGB', () => {
    bindMiniAppCSSVars(
      new MiniApp({
        bgColor: '#111111',
        headerColor: '#222222',
        botInline: false,
        version: '7.0',
        postEvent: () => null,
        createRequestId: () => 'abc',
      }),
      new ThemeParams({}),
    );

    expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#222222');
  });

  it(
    'should set --tg-header-color equal to themeParams.bgColor if miniApp.headerColor = "bg_color" and bgColor property is presented in theme params',
    () => {
      const tp = new ThemeParams({});
      tp.listen();

      bindMiniAppCSSVars(
        new MiniApp({
          bgColor: '#111111',
          headerColor: 'bg_color',
          botInline: false,
          version: '7.0',
          postEvent: () => null,
          createRequestId: () => 'abc',
        }),
        tp,
      );

      // Background only.
      expect(setCSSPropertySpy).toHaveBeenCalledTimes(1);
      setCSSPropertySpy.mockClear();

      dispatchWindowMessageEvent('theme_changed', {
        theme_params: {
          bg_color: '#ffffff',
        },
      });

      expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
      expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#ffffff');
    },
  );

  it(
    'should set --tg-header-color equal to themeParams.secondaryBackgroundColor if miniApp.headerColor = "secondary_bg_color" and secondaryBackgroundColor property is presented in theme params',
    () => {
      const tp = new ThemeParams({});
      tp.listen();

      bindMiniAppCSSVars(
        new MiniApp({
          bgColor: '#111111',
          headerColor: 'secondary_bg_color',
          botInline: false,
          version: '7.0',
          postEvent: () => null,
          createRequestId: () => 'abc',
        }),
        tp,
      );

      // Background only.
      expect(setCSSPropertySpy).toHaveBeenCalledTimes(1);
      setCSSPropertySpy.mockClear();

      dispatchWindowMessageEvent('theme_changed', {
        theme_params: {
          secondary_bg_color: '#000000',
        },
      });
      expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#000000');
    },
  );

  it('should actualize --tg-header-color if either mini app or theme params changed', () => {
    const ma = new MiniApp({
      bgColor: '#111111',
      headerColor: '#aabbcc',
      botInline: false,
      version: '7.0',
      postEvent() {
      },
      createRequestId() {
        return 'abc';
      },
    });
    const tp = new ThemeParams({
      bgColor: '#ffffff',
      secondaryBgColor: '#000000',
    });
    tp.listen();

    bindMiniAppCSSVars(ma, tp);
    setCSSPropertySpy.mockClear();

    ma.setHeaderColor('bg_color');
    expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
    expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#ffffff');
    setCSSPropertySpy.mockClear();

    ma.setHeaderColor('secondary_bg_color');
    expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
    expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#000000');
    setCSSPropertySpy.mockClear();

    dispatchWindowMessageEvent('theme_changed', {
      theme_params: {
        secondary_bg_color: '#abcdef',
      },
    });
    expect(setCSSPropertySpy).toHaveBeenCalledWith('--tg-header-color', '#abcdef');
    setCSSPropertySpy.mockClear();
  });
});

it('should set a CSS variable following a logic, described in the getCSSVarName argument', () => {
  bindMiniAppCSSVars(
    new MiniApp({
      bgColor: '#111111',
      headerColor: '#222222',
      botInline: false,
      version: '7.0',
      postEvent: () => null,
      createRequestId: () => 'abc',
    }),
    new ThemeParams({}),
    property => `--my-${property}`,
  );

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--my-bg', '#111111');
  expect(setCSSPropertySpy).toHaveBeenCalledWith('--my-header', '#222222');
});

it('should stop updating variables, if returned function was called', () => {
  const ma = new MiniApp({
    bgColor: '#111111',
    headerColor: '#222222',
    botInline: false,
    version: '7.0',
    postEvent: () => null,
    createRequestId: () => 'abc',
  });
  const cleanup = bindMiniAppCSSVars(ma, new ThemeParams({}));

  expect(setCSSPropertySpy).toHaveBeenCalledTimes(2);
  ma.setBgColor('#aaaaaa');
  expect(setCSSPropertySpy).toHaveBeenCalledTimes(4);
  cleanup();
  ma.setBgColor('#ffffff');
  expect(setCSSPropertySpy).toHaveBeenCalledTimes(4);
});

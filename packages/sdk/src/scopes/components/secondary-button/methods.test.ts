import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageSetItem } from 'test-utils';
import { emitMiniAppsEvent, type ThemeParams } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';

import { $version } from '@/scopes/globals.js';

import {
  text,
  textColor,
  isMounted,
  isEnabled,
  isLoaderVisible,
  isVisible,
  internalState,
  backgroundColor,
  hasShineEffect,
  position,
} from './signals.js';
import { onClick, offClick, setParams, mount, unmount, isSupported } from './methods.js';

vi.mock('@telegram-apps/bridge', async () => {
  const m = await vi.importActual('@telegram-apps/bridge');
  return {
    ...m,
    retrieveLaunchParams: vi.fn(() => ({
      themeParams: {
        buttonColor: '#aabbcc',
        buttonTextColor: '#ffaa12',
      } satisfies ThemeParams,
    })),
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  mockPostEvent();
});

describe.each([
  { signal: backgroundColor, name: 'backgroundColor' },
  { signal: hasShineEffect, name: 'hasShineEffect' },
  { signal: isEnabled, name: 'isEnabled' },
  { signal: isLoaderVisible, name: 'isLoaderVisible' },
  { signal: isVisible, name: 'isVisible' },
  { signal: position, name: 'position' },
  { signal: text, name: 'text' },
  { signal: textColor, name: 'textColor' },
] as const)('$name property', ({ signal, name }) => {
  beforeEach(() => {
    internalState.set({
      backgroundColor: '#123456',
      hasShineEffect: true,
      isEnabled: true,
      isLoaderVisible: true,
      isVisible: true,
      position: 'right',
      text: 'TEXT',
      textColor: '#789abc',
    });
  });

  it(`should use "${name}" property from state`, () => {
    expect(signal()).toBe(internalState()[name]);
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 7.10. True otherwise', () => {
    $version.set('7.9');
    expect(isSupported()).toBe(false);

    $version.set('7.10');
    expect(isSupported()).toBe(true);

    $version.set('7.11');
    expect(isSupported()).toBe(true);
  });
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('setParams', () => {
    it('should save the state in storage key tapps/secondaryButton', () => {
      internalState.set({
        backgroundColor: '#123456',
        hasShineEffect: true,
        isEnabled: true,
        isLoaderVisible: true,
        isVisible: true,
        position: 'top',
        text: 'TEXT',
        textColor: '#789abc',
      });

      const spy = mockSessionStorageSetItem();
      setParams({
        backgroundColor: '#111111',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/secondaryButton', '{"backgroundColor":"#111111","hasShineEffect":true,"isEnabled":true,"isLoaderVisible":true,"isVisible":true,"position":"top","text":"TEXT","textColor":"#789abc"}');
    });

    it('should call "web_app_setup_secondary_button" only if text is not empty', () => {
      const spy = mockPostEvent();
      internalState.set({
        backgroundColor: '#123456',
        hasShineEffect: false,
        isEnabled: true,
        isLoaderVisible: true,
        isVisible: true,
        position: 'bottom',
        text: '',
        textColor: '#789abc',
      });
      setParams({ text: '' });

      expect(spy).toHaveBeenCalledTimes(0);
      setParams({ text: 'abc' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_setup_secondary_button', {
        color: '#123456',
        has_shine_effect: false,
        is_active: true,
        is_progress_visible: true,
        is_visible: true,
        position: 'bottom',
        text: 'abc',
        text_color: '#789abc',
      });
    });
  });
});

describe('not mounted', () => {
  describe('setParams', () => {
    it('should not call postEvent', () => {
      const spy = mockPostEvent();
      setParams({ text: 'ABC' });
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should not save state in storage', () => {
      const spy = mockSessionStorageSetItem();
      setParams({ text: 'ABC' });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});

describe('mount', () => {
  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
  });

  // describe('page reload', () => {
  //   beforeEach(() => {
  //     mockPageReload();
  //   });
  //
  //   it('should use value from session storage key "tapps/secondaryButton"', () => {
  //     const spy = vi.fn(() => JSON.stringify({
  //       backgroundColor: '#123456',
  //       isActive: true,
  //       isLoaderVisible: true,
  //       isVisible: true,
  //       text: 'TEXT',
  //       textColor: '#789abc',
  //     }));
  //     mockSessionStorageGetItem(spy);
  //     mount();
  //     expect(spy).toHaveBeenCalledTimes(1);
  //     expect(spy).toHaveBeenCalledWith('tapps/secondaryButton');
  //     expect(state()).toStrictEqual({
  //       backgroundColor: '#123456',
  //       isActive: true,
  //       isLoaderVisible: true,
  //       isVisible: true,
  //       text: 'TEXT',
  //       textColor: '#789abc',
  //     });
  //   });
  //
  //   it('should set background and text colors from theme if session storage key "tapps/secondaryButton" not presented', () => {
  //     const spy = mockSessionStorageGetItem(() => null);
  //     mount();
  //     // 2 times, because theme params calls it too.
  //     expect(spy).toHaveBeenCalledTimes(2);
  //     expect(spy).toHaveBeenNthCalledWith(1, 'tapps/secondaryButton');
  //     expect(state()).toMatchObject({
  //       backgroundColor: themeParams.buttonColor(),
  //       textColor: themeParams.buttonTextColor(),
  //     });
  //   });
  // });
  //
  // describe('first launch', () => {
  //   it('should set background and text colors from theme', () => {
  //     mount();
  //     expect(state()).toMatchObject({
  //       backgroundColor: themeParams.buttonColor(),
  //       textColor: themeParams.buttonTextColor(),
  //     });
  //   });
  // });
});

describe('onClick', () => {
  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('secondary_button_pressed');
    emitMiniAppsEvent('secondary_button_pressed');
    emitMiniAppsEvent('secondary_button_pressed');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('secondary_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('offClick', () => {
  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('setParams', () => {
  it('should merge passed object with the state', () => {
    internalState.set({
      backgroundColor: '#123456',
      hasShineEffect: true,
      isEnabled: true,
      isLoaderVisible: true,
      isVisible: true,
      position: 'right',
      text: 'TEXT',
      textColor: '#789abc',
    });

    setParams({
      backgroundColor: '#111111',
      isEnabled: false,
      isLoaderVisible: false,
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });

    expect(internalState()).toStrictEqual({
      backgroundColor: '#111111',
      hasShineEffect: true,
      isEnabled: false,
      isLoaderVisible: false,
      isVisible: true,
      position: 'right',
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when something changes', () => {
    const postEventSpy = mockPostEvent();
    const storageSpy = mockSessionStorageSetItem();
    internalState.set({ ...internalState(), text: 'Hello!' });
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    internalState.set({ ...internalState() });

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

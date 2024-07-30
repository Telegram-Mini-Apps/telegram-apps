import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockPageReload, mockSessionStorageGetItem, mockSessionStorageSetItem } from 'test-utils';

import { resetGlobals } from '@test-utils/resetGlobals.js';

import { postEvent } from '@/globals/globals.js';
import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';
import * as themeParams from '@/theme-params/themeParams.js';
import type { ThemeParams } from '@/theme-params/types.js';

import { state as _state, isMounted as _isMounted } from './mainButton.private.js';
import {
  text,
  textColor,
  isMounted,
  isActive,
  isLoaderVisible,
  isVisible,
  state,
  backgroundColor,
  onClick,
  offClick,
  setParams,
  mount,
  unmount,
} from './mainButton.js';

vi.mock('@/launch-params/retrieveLaunchParams.js', () => ({
  retrieveLaunchParams: () => ({
    themeParams: {
      buttonColor: '#aabbcc',
      buttonTextColor: '#ffaa12',
    } satisfies ThemeParams,
  }),
}));

beforeEach(() => {
  resetGlobals();
  _state.reset();
  _state.unsubAll();
  _isMounted.reset();
  _isMounted.unsubAll();

  state.unsubAll();
  isActive.unsubAll();
  isLoaderVisible.unsubAll();
  isVisible.unsubAll();
  text.unsubAll();
  textColor.unsubAll();
  backgroundColor.unsubAll();

  themeParams.unmount();

  vi.restoreAllMocks();
  postEvent.set(() => null);
});

describe.each([
  { signal: backgroundColor, name: 'backgroundColor' },
  { signal: isActive, name: 'isActive' },
  { signal: isLoaderVisible, name: 'isLoaderVisible' },
  { signal: isVisible, name: 'isVisible' },
  { signal: text, name: 'text' },
  { signal: textColor, name: 'textColor' },
] as const)('$name property', ({ signal, name }) => {
  beforeEach(() => {
    _state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });
  });

  it(`should use "${name}" property from state`, () => {
    expect(signal()).toBe(state()[name]);
  });
});

describe('mounted', () => {
  beforeEach(mount);
  afterEach(unmount);

  describe('setParams', () => {
    it('should save the state in storage key telegram-apps/main-button', () => {
      _state.set({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      });

      const spy = mockSessionStorageSetItem();
      setParams({
        backgroundColor: '#111111',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/main-button', '{"backgroundColor":"#111111","isActive":true,"isLoaderVisible":true,"isVisible":true,"text":"TEXT","textColor":"#789abc"}');
    });

    it('should call "web_app_setup_main_button" only if text is not empty', () => {
      const spy = vi.fn(() => null);
      postEvent.set(spy);
      _state.set({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: '',
        textColor: '#789abc',
      });
      setParams({ text: '' });

      expect(spy).toHaveBeenCalledTimes(0);
      setParams({ text: 'abc' });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('web_app_setup_main_button', {
        is_visible: true,
        is_active: true,
        is_progress_visible: true,
        text: 'abc',
        color: '#123456',
        text_color: '#789abc',
      });
    });
  });
});

describe('not mounted', () => {
  describe('setParams', () => {
    it('should not call postEvent', () => {
      const spy = vi.fn(() => null);
      postEvent.set(spy);
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
  afterEach(unmount);

  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use value from session storage key "telegram-apps/main-button"', () => {
      const spy = vi.fn(() => JSON.stringify({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      }));
      mockSessionStorageGetItem(spy);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/main-button');
      expect(state()).toStrictEqual({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      });
    });

    it('should set background and text colors from theme if session storage key "telegram-apps/main-button" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      // 2 times, because theme params calls it too.
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'telegram-apps/main-button');
      expect(state()).toMatchObject({
        backgroundColor: themeParams.buttonColor(),
        textColor: themeParams.buttonTextColor(),
      });
    });
  });

  describe('first launch', () => {
    it('should set background and text colors from theme', () => {
      mount();
      expect(state()).toMatchObject({
        backgroundColor: themeParams.buttonColor(),
        textColor: themeParams.buttonTextColor(),
      });
    });
  });
});

describe('onClick', () => {
  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('main_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('main_button_pressed', {});
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
    _state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });

    setParams({
      backgroundColor: '#111111',
      isActive: false,
      isLoaderVisible: false,
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });

    expect(state()).toStrictEqual({
      backgroundColor: '#111111',
      isActive: false,
      isLoaderVisible: false,
      isVisible: true,
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });
  });
});

describe('unmount', () => {
  beforeEach(mount);

  it('should stop calling postEvent function and session storage updates when something changes', () => {
    const postEventSpy = vi.fn();
    const storageSpy = mockSessionStorageSetItem();
    postEvent.set(postEventSpy);
    _state.set({ ..._state(), text: 'Hello!' });
    expect(postEventSpy).toHaveBeenCalledTimes(1);
    expect(storageSpy).toHaveBeenCalledTimes(1);

    postEventSpy.mockClear();
    storageSpy.mockClear();

    unmount();
    _state.set({ ..._state() });

    expect(postEventSpy).toHaveBeenCalledTimes(0);
    expect(storageSpy).toHaveBeenCalledTimes(0);
  });
});

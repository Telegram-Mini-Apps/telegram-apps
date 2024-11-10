import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';
import { emitMiniAppsEvent } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';

import {
  mount,
  onClick,
  unmount,
  offClick,
  setParams,
} from './methods.js';
import {
  text,
  textColor,
  isEnabled,
  isMounted,
  isVisible,
  state,
  internalState,
  backgroundColor,
  hasShineEffect,
  isLoaderVisible,
} from './signals.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  isMounted.set(true);
}

describe.each([
  ['setParams', setParams, { isMounted, call: () => setParams({}) }],
  ['mount', mount, {}],
  ['onClick', onClick, {}],
  ['offClick', offClick, {}],
] as const)('%s', (name, fn, options) => {
  testSafety(fn, name, {
    ...options,
    component: 'mainButton',
  });
});

describe.each([
  ['backgroundColor', backgroundColor],
  ['hasShineEffect', hasShineEffect],
  ['isEnabled', isEnabled],
  ['isLoaderVisible', isLoaderVisible],
  ['isVisible', isVisible],
  ['text', text],
  ['textColor', textColor],
] as const)('%s', (name, signal) => {
  beforeEach(() => {
    internalState.set({
      backgroundColor: '#123456',
      hasShineEffect: true,
      isEnabled: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });
  });

  it(`should use "${name}" property from state`, () => {
    expect(signal()).toBe(internalState()[name]);
  });
});

describe('mount', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should set isMounted = true', () => {
    expect(isMounted()).toBe(false);
    mount();
    expect(isMounted()).toBe(true);
  });

  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use value from session storage key "tapps/mainButton"', () => {
      const spy = mockSessionStorageGetItem(() => JSON.stringify({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      }));
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/mainButton');
      expect(state()).toStrictEqual({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      });
    });

    it('should preserve state if session storage key "tapps/mainButton" not presented', () => {
      const s = state();
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/mainButton');
      expect(s).toStrictEqual(state());
    });
  });

  describe('first launch', () => {
    it('should preserve state', () => {
      const s = state();
      mount();
      expect(state()).toBe(s);
    });
  });
});

describe('onClick', () => {
  beforeEach(setAvailable);

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
  beforeEach(setAvailable);

  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('main_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('setParams', () => {
  beforeEach(setAvailable);

  it('should save the state in storage key tapps/mainButton', () => {
    internalState.set({
      backgroundColor: '#123456',
      hasShineEffect: true,
      isEnabled: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });

    const spy = mockSessionStorageSetItem();
    setParams({
      backgroundColor: '#111111',
    });

    // Should call retrieveLaunchParams + save component state.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'tapps/mainButton', '{"backgroundColor":"#111111","hasShineEffect":true,"isEnabled":true,"isLoaderVisible":true,"isVisible":true,"text":"TEXT","textColor":"#789abc"}');
  });

  it('should call "web_app_setup_main_button" only if text is not empty', () => {
    const spy = mockPostEvent();
    internalState.set({
      backgroundColor: '#123456',
      hasShineEffect: false,
      isEnabled: true,
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
      has_shine_effect: false,
      is_visible: true,
      is_active: true,
      is_progress_visible: true,
      text: 'abc',
      color: '#123456',
      text_color: '#789abc',
    });
  });
});

describe('unmount', () => {
  beforeEach(setAvailable);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});

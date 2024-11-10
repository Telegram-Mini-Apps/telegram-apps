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
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';

import {
  show,
  hide,
  mount,
  onClick,
  unmount,
  offClick,
  isSupported,
  isVisible,
  isMounted,
} from './back-button.js';

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
  ['hide', hide, isMounted],
  ['show', show, isMounted],
  ['mount', mount, undefined],
  ['onClick', onClick, undefined],
  ['offClick', offClick, undefined],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'backButton',
    minVersion: '6.1',
    isMounted,
  });
});

describe.each([
  ['hide', hide, false],
  ['show', show, true],
])('%s', (_name, fn, value) => {
  beforeEach(setAvailable);

  it(`should set isVisible = ${value}`, () => {
    isVisible.set(!value);
    expect(isVisible()).toBe(!value);
    fn();
    expect(isVisible()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_back_button" and { is_visible: ${value} }`, () => {
    isVisible.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_back_button', { is_visible: value });
  });

  it(`should call sessionStorage.setItem with "tapps/backButton" and "${value}" if value changed`, () => {
    isVisible.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    // Should call retrieveLaunchParams.
    expect(spy).toHaveBeenCalledOnce();

    spy.mockClear();

    isVisible.set(!value);
    fn();
    // Should call retrieveLaunchParams + save component state.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'tapps/backButton', String(value));
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '6.1');
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

    it('should use value from session storage key "tapps/backButton"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/backButton');
      expect(isVisible()).toBe(true);
    });

    it('should set isVisible false if session storage key "tapps/backButton" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/backButton');
      expect(isVisible()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVisible false', () => {
      mount();
      expect(isVisible()).toBe(false);
    });
  });
});

describe('onClick', () => {
  beforeEach(setAvailable);

  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('offClick', () => {
  beforeEach(setAvailable);

  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
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

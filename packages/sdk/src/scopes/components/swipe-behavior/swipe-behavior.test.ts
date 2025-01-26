import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';

import {
  isMounted,
  _isMounted,
  _isVerticalEnabled,
  mount,
  unmount,
  isSupported,
  enableVertical,
  disableVertical,
  isVerticalEnabled,
} from './swipe-behavior.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
  _isMounted.set(true);
}

describe.each([
  ['disableVertical', disableVertical, _isMounted],
  ['enableVertical', enableVertical, _isMounted],
  ['mount', mount, undefined],
] as const)('%s', (name, fn, isMounted) => {
  testSafety(fn, name, {
    component: 'swipeBehavior',
    minVersion: '7.7',
    isMounted,
  });
});

describe.each([
  ['disableVertical', disableVertical, false],
  ['enableVertical', enableVertical, true],
])('%s', (_, fn, value) => {
  beforeEach(setAvailable);

  it(`should set isConfirmationEnabled = ${value}`, () => {
    _isVerticalEnabled.set(!value);
    expect(isVerticalEnabled()).toBe(!value);
    fn();
    expect(isVerticalEnabled()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: ${value} }`, () => {
    _isVerticalEnabled.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: value });
  });

  it(`should call sessionStorage.setItem with "tapps/swipeBehavior" and "${value}" if value changed`, () => {
    _isVerticalEnabled.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    // Should call retrieveLaunchParams.
    expect(spy).toHaveBeenCalledOnce();

    spy.mockClear();

    _isVerticalEnabled.set(!value);
    fn();
    // Should call retrieveLaunchParams + save component state.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'tapps/swipeBehavior', String(value));
  });
});

describe('isSupported', () => {
  testIsSupported(isSupported, '7.7');
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

    it('should use value from session storage key "tapps/swipeBehavior"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalEnabled()).toBe(true);
    });

    it('should set isConfirmationEnabled false if session storage key "tapps/swipeBehavior" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/swipeBehavior');
      expect(isVerticalEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isConfirmationEnabled false', () => {
      mount();
      expect(isVerticalEnabled()).toBe(false);
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

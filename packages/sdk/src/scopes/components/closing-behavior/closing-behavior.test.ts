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

import {
  _isMounted,
  isMounted,
  mount,
  unmount,
  enableConfirmation,
  _isConfirmationEnabled,
  isConfirmationEnabled,
  disableConfirmation,
} from './closing-behavior.js';

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
  ['disableConfirmation', disableConfirmation, { isMounted: _isMounted }],
  ['enableConfirmation', enableConfirmation, {}],
  ['mount', mount, {}],
] as const)('%s', (name, fn, options) => {
  testSafety(fn, name, {
    ...options,
    component: 'closingBehavior',
  });
});

describe.each([
  ['disableConfirmation', disableConfirmation, false],
  ['enableConfirmation', enableConfirmation, true],
])('%s', (_, fn, value) => {
  beforeEach(setAvailable);

  it(`should set isConfirmationEnabled = ${value}`, () => {
    _isConfirmationEnabled.set(!value);
    expect(isConfirmationEnabled()).toBe(!value);
    fn();
    expect(isConfirmationEnabled()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: ${value} }`, () => {
    _isConfirmationEnabled.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: value });
  });

  it(`should call sessionStorage.setItem with "tapps/closingBehavior" and "${value}" if value changed`, () => {
    _isConfirmationEnabled.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    // Should call retrieveLaunchParams.
    expect(spy).toHaveBeenCalledOnce();

    spy.mockClear();

    _isConfirmationEnabled.set(!value);
    fn();
    // Should call retrieveLaunchParams + save component state.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(2, 'tapps/closingBehavior', String(value));
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

    it('should use value from session storage key "tapps/closingBehavior"', () => {
      const spy = mockSessionStorageGetItem(() => 'true');
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/closingBehavior');
      expect(isConfirmationEnabled()).toBe(true);
    });

    it('should set isConfirmationEnabled false if session storage key "tapps/closingBehavior" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/closingBehavior');
      expect(isConfirmationEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isConfirmationEnabled false', () => {
      mount();
      expect(isConfirmationEnabled()).toBe(false);
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

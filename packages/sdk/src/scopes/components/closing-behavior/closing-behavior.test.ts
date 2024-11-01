import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';

import {
  disableConfirmation,
  enableConfirmation,
  mount,
  unmount,
  isMounted,
  isConfirmationEnabled,
} from './closing-behavior.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setReady() {
  isMounted.set(true);
  setInitialized();
}

describe('check initialization and mount', () => {
  describe.each([
    { name: 'disableConfirmation', fn: disableConfirmation },
    { name: 'enableConfirmation', fn: enableConfirmation },
  ])('$name', ({ fn }) => {
    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const error = new TypedError(
        'ERR_NOT_INITIALIZED',
        'The package was not initialized. Consider using the package init() function',
      );
      expect(fn).toThrow(error);
      setInitialized();
      expect(fn).not.toThrow(error);
    });

    describe('initialized', () => {
      beforeEach(setInitialized);

      it('should throw ERR_NOT_MOUNTED if component was not mounted', () => {
        const error = new TypedError(
          'ERR_NOT_MOUNTED',
          'closingBehavior component is not mounted. Consider using the mount() method',
        );
        expect(fn).toThrow(error);
        isMounted.set(true);
        expect(fn).not.toThrow(error);
      });
    });
  });
});

describe.each([
  { name: 'disableConfirmation', fn: disableConfirmation, value: false },
  { name: 'enableConfirmation', fn: enableConfirmation, value: true },
])('$name', ({ fn, value }) => {
  beforeEach(setReady);

  it(`should set isConfirmationEnabled = ${value}`, () => {
    isConfirmationEnabled.set(!value);
    expect(isConfirmationEnabled()).toBe(!value);
    fn();
    expect(isConfirmationEnabled()).toBe(value);
  });

  it(`should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: ${value} }`, () => {
    isConfirmationEnabled.set(!value);
    const spy = mockPostEvent();
    fn();
    fn();
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: value });
  });

  it(`should call sessionStorage.setItem with "tapps/closingBehavior" and "${value}" if value changed`, () => {
    isConfirmationEnabled.set(value);
    const spy = mockSessionStorageSetItem();
    fn();
    expect(spy).not.toHaveBeenCalled();

    isConfirmationEnabled.set(!value);
    fn();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('tapps/closingBehavior', String(value));
  });
});

describe('mount', () => {
  beforeEach(setInitialized);

  it('should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: false }', () => {
    const spy = mockPostEvent();
    mount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
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

    it('should set isVerticalSwipesEnabled false if session storage key "tapps/closingBehavior" not presented', () => {
      const spy = mockSessionStorageGetItem(() => null);
      mount();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('tapps/closingBehavior');
      expect(isConfirmationEnabled()).toBe(false);
    });
  });

  describe('first launch', () => {
    it('should set isVerticalSwipesEnabled false', () => {
      mount();
      expect(isConfirmationEnabled()).toBe(false);
    });
  });
});

describe('unmount', () => {
  beforeEach(setReady);

  it('should set isMounted = false', () => {
    expect(isMounted()).toBe(true);
    unmount();
    expect(isMounted()).toBe(false);
  });
});

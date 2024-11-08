import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import {
  isMounted,
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
  setInitialized();
  mockMiniAppsEnv();
  isMounted.set(true);
}

describe.each([
  ['disableVertical', disableVertical],
  ['enableVertical', enableVertical],
  ['mount', mount],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the swipeBehavior.${name}() method: it can't be called outside Mini Apps`,
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
          `Unable to call the swipeBehavior.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the swipeBehavior.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setInitialized();
      expect(fn).not.toThrow(err);
    });

    describe('package initialized', () => {
      beforeEach(setInitialized);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 7.7', () => {
        $version.set('7.6');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the swipeBehavior.${name}() method: it is unsupported in Mini Apps version 7.6`,
          ),
        );
        $version.set('7.7');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_SUPPORTED',
            `Unable to call the swipeBehavior.${name}() method: it is unsupported in Mini Apps version 7.7`,
          ),
        );
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 7.7 or higher. False otherwise', () => {
      $version.set('7.6');
      expect(fn.isSupported()).toBe(false);
      $version.set('7.7');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe.each([
  ['mount', mount],
] as const)('%s', (_, fn) => {
  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    describe('package initialized', () => {
      beforeEach(setInitialized);

      it('should not throw', () => {
        expect(fn).not.toThrow();
      });
    });
  });
});

// disableConfirmation + enableConfirmation complete
describe.each([
  ['disableVertical', disableVertical, false],
  ['enableVertical', enableVertical, true],
])('%s', (name, fn, value) => {
  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    describe('package initialized', () => {
      beforeEach(setInitialized);

      it('should throw ERR_NOT_MOUNTED if swipeBehavior is not mounted', () => {
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_MOUNTED',
            `Unable to call the swipeBehavior.${name}() method: the component is not mounted. Use the swipeBehavior.mount() method`,
          ),
        );
      });

      describe('mounted', () => {
        beforeEach(() => {
          isMounted.set(true);
        });

        it('should not throw', () => {
          expect(fn).not.toThrow();
        });
      });
    });
  });

  describe('env is ready', () => {
    beforeEach(setAvailable);

    it(`should set isConfirmationEnabled = ${value}`, () => {
      isVerticalEnabled.set(!value);
      expect(isVerticalEnabled()).toBe(!value);
      fn();
      expect(isVerticalEnabled()).toBe(value);
    });

    it(`should call postEvent with "web_app_setup_swipe_behavior" and { allow_vertical_swipe: ${value} }`, () => {
      isVerticalEnabled.set(!value);
      const spy = mockPostEvent();
      fn();
      fn();
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: value });
    });

    it(`should call sessionStorage.setItem with "tapps/swipeBehavior" and "${value}" if value changed`, () => {
      isVerticalEnabled.set(value);
      const spy = mockSessionStorageSetItem();
      fn();
      // Should call retrieveLaunchParams.
      expect(spy).toHaveBeenCalledOnce();

      spy.mockClear();

      isVerticalEnabled.set(!value);
      fn();
      // Should call retrieveLaunchParams + save component state.
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(2, 'tapps/swipeBehavior', String(value));
    });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 7.7', () => {
    $version.set('7.6');
    expect(isSupported()).toBe(false);

    $version.set('7.7');
    expect(isSupported()).toBe(true);
  });
});

describe('mount', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setInitialized();
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

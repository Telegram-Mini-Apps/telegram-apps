import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockSessionStorageGetItem,
  mockPageReload,
  mockSessionStorageSetItem,
} from 'test-utils';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';

import {
  isMounted,
  mount,
  unmount,
  enableConfirmation,
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
  isMounted.set(true);
}

describe.each([
  ['disableConfirmation', disableConfirmation],
  ['enableConfirmation', enableConfirmation],
  ['mount', mount],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the closingBehavior.${name}() method: it can't be called outside Mini Apps`,
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
          `Unable to call the closingBehavior.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the closingBehavior.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });
  });
});

describe.each([
  ['mount', mount],
] as const)('%s', (_, fn) => {
  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should not throw', () => {
        expect(fn).not.toThrow();
      });
    });
  });
});

// disableConfirmation + enableConfirmation complete
describe.each([
  ['disableConfirmation', disableConfirmation, false],
  ['enableConfirmation', enableConfirmation, true],
])('%s', (name, fn, value) => {
  describe('mini apps env', () => {
    beforeEach(mockMiniAppsEnv);

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should throw ERR_NOT_MOUNTED if closingBehavior is not mounted', () => {
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_MOUNTED',
            `Unable to call the closingBehavior.${name}() method: the component is not mounted. Use the closingBehavior.mount() method`,
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
      // Should call retrieveLaunchParams.
      expect(spy).toHaveBeenCalledOnce();

      spy.mockClear();

      isConfirmationEnabled.set(!value);
      fn();
      // Should call retrieveLaunchParams + save component state.
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(2, 'tapps/closingBehavior', String(value));
    });
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

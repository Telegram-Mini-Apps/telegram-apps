import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setMaxVersion } from '@test-utils/setMaxVersion.js';
import { mockMiniAppsEnv } from '@test-utils/mockMiniAppsEnv.js';
import { mockSSR } from '@test-utils/mockSSR.js';
import { $version } from '@/scopes/globals.js';

import {
  isSupported,
  impactOccurred,
  notificationOccurred,
  selectionChanged,
} from './haptic-feedback.js';

beforeEach(() => {
  resetPackageState();
  vi.restoreAllMocks();
  mockPostEvent();
});

function setAvailable() {
  setMaxVersion();
  mockMiniAppsEnv();
}

describe.each([
  ['impactOccurred', impactOccurred],
  ['notificationOccurred', notificationOccurred],
  ['selectionChanged', selectionChanged],
] as const)('%s', (name, fn) => {
  it('should throw ERR_UNKNOWN_ENV if not in Mini Apps', () => {
    const err = new TypedError(
      'ERR_UNKNOWN_ENV',
      `Unable to call the hapticFeedback.${name}() method: it can't be called outside Mini Apps`,
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
          `Unable to call the hapticFeedback.${name}() method: it can't be called outside Mini Apps`,
        ),
      );
    });

    it('should throw ERR_NOT_INITIALIZED if package is not initialized', () => {
      const err = new TypedError(
        'ERR_NOT_INITIALIZED',
        `Unable to call the hapticFeedback.${name}() method: the SDK was not initialized. Use the SDK init() function`,
      );
      expect(fn).toThrow(err);
      setMaxVersion();
      expect(fn).not.toThrow(err);
    });

    describe('package initialized', () => {
      beforeEach(setMaxVersion);

      it('should throw ERR_NOT_SUPPORTED if Mini Apps version is less than 6.1', () => {
        $version.set('6.0');
        expect(fn).toThrow(
          new TypedError(
            'ERR_NOT_INITIALIZED',
            `Unable to call the hapticFeedback.${name}() method: it is unsupported in Mini Apps version 6.0`,
          ),
        );
        $version.set('6.1');
        expect(fn).not.toThrow(
          new TypedError(
            'ERR_NOT_INITIALIZED',
            `Unable to call the hapticFeedback.${name}() method: it is unsupported in Mini Apps version 6.1`,
          ),
        );
      });

      describe('Mini Apps version is 6.1', () => {
        beforeEach(() => {
          $version.set('6.1');
        });

        it('should not throw', () => {
          expect(fn).not.toThrow();
        });
      });
    });
  });

  describe('isSupported', () => {
    it('should return true only if Mini Apps version is 6.1 or higher. False otherwise', () => {
      $version.set('6.0');
      expect(fn.isSupported()).toBe(false);
      $version.set('6.1');
      expect(fn.isSupported()).toBe(true);
    });
  });
});

describe('impactOccurred', () => {
  beforeEach(setAvailable);

  it('should call "web_app_trigger_haptic_feedback" method with { type: "impact", style: {{style}} }', () => {
    const spy = mockPostEvent();
    impactOccurred('heavy');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'heavy',
    });
  });
});

describe('notificationOccurred', () => {
  beforeEach(setAvailable);

  it('should call "web_app_trigger_haptic_feedback" method with { type: "notification", notification_type: {{type}} }', () => {
    const spy = mockPostEvent();
    notificationOccurred('success');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'notification',
      notification_type: 'success',
    });
  });
});

describe('selectionChanged', () => {
  beforeEach(setAvailable);

  it('should call "web_app_trigger_haptic_feedback" method with { type: "selection_change" }', () => {
    const spy = mockPostEvent();
    selectionChanged();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  });
});

describe('isSupported', () => {
  it('should return false if version is less than 6.1', () => {
    $version.set('6.0');
    expect(isSupported()).toBe(false);

    $version.set('6.1');
    expect(isSupported()).toBe(true);
  });
});

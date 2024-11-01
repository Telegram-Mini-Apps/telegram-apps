import { beforeEach, describe, expect, it } from 'vitest';
import { TypedError } from '@telegram-apps/bridge';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';
import { setInitialized } from '@test-utils/setInitialized.js';
import { $version } from '@/scopes/globals.js';

import {
  impactOccurred,
  notificationOccurred,
  selectionChanged,
  isSupported,
} from './haptic-feedback.js';

beforeEach(() => {
  resetPackageState();
  mockPostEvent();
});

describe('check support', () => {
  describe.each([
    { name: 'impactOccurred', fn: impactOccurred },
    { name: 'notificationOccurred', fn: notificationOccurred },
    { name: 'selectionChanged', fn: selectionChanged },
  ])('$name', ({ fn, name }) => {
    it('should throw ERR_NOT_SUPPORTED if package is not initialized', () => {
      const error = new TypedError(
        'ERR_NOT_SUPPORTED',
        `hapticFeedback.${name}() method is not supported in Mini Apps version 6.0`,
      );
      $version.set('6.0');
      expect(fn).toThrow(error);
      $version.set('6.1');
      expect(fn).not.toThrow(error);
    });

    describe('isSupported', () => {
      it('should return false if version is less than 6.1', () => {
        $version.set('6.0');
        expect(fn.isSupported()).toBe(false);

        $version.set('6.1');
        expect(fn.isSupported()).toBe(true);
      });
    });
  });
});

describe('impactOccurred', () => {
  beforeEach(setInitialized);

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

describe('isSupported', () => {
  it('should return false if version is less than 6.1', () => {
    $version.set('6.0');
    expect(isSupported()).toBe(false);

    $version.set('6.1');
    expect(isSupported()).toBe(true);
  });
});

describe('notificationOccurred', () => {
  beforeEach(setInitialized);

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
  beforeEach(setInitialized);

  it('should call "web_app_trigger_haptic_feedback" method with { type: "selection_change" }', () => {
    const spy = mockPostEvent();
    selectionChanged();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  });
});

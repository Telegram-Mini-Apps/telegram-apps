import { beforeEach, describe, expect, it } from 'vitest';

import { mockPostEvent } from '@test-utils/mockPostEvent.js';
import { resetPackageState } from '@test-utils/reset/reset.js';

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

describe('impactOccurred', () => {
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
  it('should return false if version is less than 6.1. True otherwise', () => {
    $version.set('6.0');
    expect(isSupported()).toBe(false);

    $version.set('6.1');
    expect(isSupported()).toBe(true);

    $version.set('6.2');
    expect(isSupported()).toBe(true);
  });
});

describe('notificationOccurred', () => {
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
  it('should call "web_app_trigger_haptic_feedback" method with { type: "selection_change" }', () => {
    const spy = mockPostEvent();
    selectionChanged();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  });
});

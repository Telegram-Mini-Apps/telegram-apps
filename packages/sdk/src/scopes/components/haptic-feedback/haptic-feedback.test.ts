import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
  mockMiniAppsEnv,
} from '@test-utils/utils.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';

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
  testSafety(fn, name, {
    component: 'hapticFeedback',
    minVersion: '6.1',
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
  testIsSupported(isSupported, '6.1');
});

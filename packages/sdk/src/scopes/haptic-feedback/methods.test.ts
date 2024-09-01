import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetPackageState } from '@test-utils/resetPackageState.js';

import { $postEvent, $version } from '@/scopes/globals/globals.js';

import {
  impactOccurred,
  notificationOccurred,
  selectionChanged,
} from './methods.js';

beforeEach(() => {
  resetPackageState();
  $postEvent.set(() => null);
});

describe('impactOccurred', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "impact", style: {{style}} }', () => {
    const spy = vi.fn(() => null);
    $postEvent.set(spy);
    impactOccurred('heavy');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'heavy',
    });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      $version.set('6.0');
      expect(impactOccurred.isSupported()).toBe(false);

      $version.set('6.1');
      expect(impactOccurred.isSupported()).toBe(true);

      $version.set('6.2');
      expect(impactOccurred.isSupported()).toBe(true);
    });
  });
});

describe('notificationOccurred', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "notification", notification_type: {{type}} }', () => {
    const spy = vi.fn(() => null);
    $postEvent.set(spy);
    notificationOccurred('success');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'notification',
      notification_type: 'success',
    });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      $version.set('6.0');
      expect(notificationOccurred.isSupported()).toBe(false);

      $version.set('6.1');
      expect(notificationOccurred.isSupported()).toBe(true);

      $version.set('6.2');
      expect(notificationOccurred.isSupported()).toBe(true);
    });
  });
});

describe('selectionChanged', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "selection_change" }', () => {
    const spy = vi.fn(() => null);
    $postEvent.set(spy);
    selectionChanged();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  });

  describe('isSupported', () => {
    it('should return false if version is less than 6.1. True otherwise', () => {
      $version.set('6.0');
      expect(selectionChanged.isSupported()).toBe(false);

      $version.set('6.1');
      expect(selectionChanged.isSupported()).toBe(true);

      $version.set('6.2');
      expect(selectionChanged.isSupported()).toBe(true);
    });
  });
});

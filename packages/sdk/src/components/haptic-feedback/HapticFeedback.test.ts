import { describe, expect, it, vi } from 'vitest';

import { HapticFeedback } from './HapticFeedback.js';

describe('impactOccurred', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "impact", style: {{style}} }', () => {
    const postEvent = vi.fn();
    const haptic = new HapticFeedback('', postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    haptic.impactOccurred('heavy');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'impact',
      impact_style: 'heavy',
    });
  });
});

describe('notificationOccurred', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "notification", notification_type: {{type}} }', () => {
    const postEvent = vi.fn();
    const haptic = new HapticFeedback('', postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    haptic.notificationOccurred('success');
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'notification',
      notification_type: 'success',
    });
  });
});

describe('selectionChanged', () => {
  it('should call "web_app_trigger_haptic_feedback" method with { type: "selection_change" }', () => {
    const postEvent = vi.fn();
    const haptic = new HapticFeedback('', postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    haptic.selectionChanged();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_trigger_haptic_feedback', {
      type: 'selection_change',
    });
  });
});

describe('supports', () => {
  describe('impactOccurred / notificationOccurred / selectionChanged', () => {
    it('should return true in case, HapticFeedback version is 6.1 or higher. False, otherwise', () => {
      const haptic1 = new HapticFeedback('6.0', () => null);
      expect(haptic1.supports('impactOccurred')).toBe(false);
      expect(haptic1.supports('notificationOccurred')).toBe(false);
      expect(haptic1.supports('selectionChanged')).toBe(false);

      const haptic2 = new HapticFeedback('6.1', () => null);
      expect(haptic2.supports('impactOccurred')).toBe(true);
      expect(haptic2.supports('notificationOccurred')).toBe(true);
      expect(haptic2.supports('selectionChanged')).toBe(true);

      const haptic3 = new HapticFeedback('6.2', () => null);
      expect(haptic3.supports('impactOccurred')).toBe(true);
      expect(haptic3.supports('notificationOccurred')).toBe(true);
      expect(haptic3.supports('selectionChanged')).toBe(true);
    });
  });
});

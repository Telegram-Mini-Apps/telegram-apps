import { describe, expect, it, vi } from 'vitest';

import { SwipeBehavior } from './SwipeBehavior.js';

describe('disableVerticalSwipe', () => {
  it('should call "web_app_setup_swipe_behavior" method with "allow_vertical_swipe" equal to false', () => {
    const postEvent = vi.fn(() => {});
    const behavior = new SwipeBehavior(true, '', postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    behavior.disableVerticalSwipe();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
  });

  it('should emit "isVerticalSwipeEnabledChanged" event with false value', () => {
    const behavior = new SwipeBehavior(true, '', vi.fn(() => {}));
    const listener = vi.fn();

    behavior.on('change:isVerticalSwipeEnabled', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    behavior.disableVerticalSwipe();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('enableVerticalSwipe', () => {
  it('should call "web_app_setup_swipe_behavior" method with "allow_vertical_swipe" equal to true', () => {
    const postEvent = vi.fn(() => {});
    const behavior = new SwipeBehavior(false, '', postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    behavior.enableVerticalSwipe();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: true });
  });

  it('should emit "isVerticalSwipeEnabledChanged" event with true value', () => {
    const behavior = new SwipeBehavior(false, '', vi.fn(() => {}));
    const listener = vi.fn();

    behavior.on('change:isVerticalSwipeEnabled', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    behavior.enableVerticalSwipe();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('on', () => {
  describe('"isVerticalSwipeEnabledChanged" event', () => {
    it('should add event listener to event', () => {
      const listener = vi.fn();
      const behavior = new SwipeBehavior(false, '', vi.fn(() => {}));

      behavior.on('change:isVerticalSwipeEnabled', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      behavior.enableVerticalSwipe();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

describe('off', () => {
  describe('"isVerticalSwipeEnabledChanged" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const behavior = new SwipeBehavior(false, '', vi.fn(() => {}));

      behavior.on('change:isVerticalSwipeEnabled', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      behavior.enableVerticalSwipe();
      expect(listener).toHaveBeenCalledTimes(1);

      behavior.off('change:isVerticalSwipeEnabled', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      behavior.disableVerticalSwipe();
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});

describe('supports', () => {
  describe('disableVerticalSwipe', () => {
    it('should return false if SwipeBehavior was created with version 7.6 or less. True otherwise', () => {
      expect(
        new SwipeBehavior(false, '7.6', vi.fn(() => {})).supports('disableVerticalSwipe'),
      ).toBe(false);

      expect(
        new SwipeBehavior(false, '7.7', vi.fn(() => {})).supports('disableVerticalSwipe'),
      ).toBe(true);
    });
  });

  describe('enableVerticalSwipe', () => {
    it('should return false if SwipeBehavior was created with version 7.6 or less. True otherwise', () => {
      expect(
        new SwipeBehavior(false, '7.6', vi.fn(() => {})).supports('enableVerticalSwipe')
      ).toBe(false);

      expect(
        new SwipeBehavior(false, '7.7', vi.fn(() => {})).supports('enableVerticalSwipe')
      ).toBe(true);
    })
  })
});
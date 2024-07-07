import { describe, expect, it, vi } from 'vitest';

import { SwipeBehavior } from './SwipeBehavior.js';

describe('disable', () => {
  it('should call "web_app_setup_swipe_behavior" method with "allow_vertical_swipe" equal to false', () => {
    const postEvent = vi.fn();
    const confirmation = new SwipeBehavior(true, postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    confirmation.disableVerticalSwipes();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
  });

  it('should emit "isVerticalSwipesEnabledChanged" event with false value', () => {
    const confirmation = new SwipeBehavior(true, vi.fn());
    const listener = vi.fn();

    confirmation.on('change:isVerticalSwipesEnabled', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    confirmation.disableVerticalSwipes();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('enable', () => {
  it('should call "web_app_setup_swipe_behavior" method with "allow_vertical_swipe" equal to true', () => {
    const postEvent = vi.fn();
    const confirmation = new SwipeBehavior(false, postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    confirmation.enableVerticalSwipes();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_swipe_behavior', { allow_vertical_swipe: true });
  });

  it('should emit "isVerticalSwipesEnabledChanged" event with true value', () => {
    const confirmation = new SwipeBehavior(false, vi.fn());
    const listener = vi.fn();

    confirmation.on('change:isVerticalSwipesEnabled', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    confirmation.enableVerticalSwipes();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('on', () => {
  describe('"isVerticalSwipesEnabledChanged" event', () => {
    it('should add event listener to event', () => {
      const listener = vi.fn();
      const confirmation = new SwipeBehavior(false, vi.fn());

      confirmation.on('change:isVerticalSwipesEnabled', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.enableVerticalSwipes();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

describe('off', () => {
  describe('"isVerticalSwipesEnabledChanged" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const confirmation = new SwipeBehavior(false, vi.fn());

      confirmation.on('change:isVerticalSwipesEnabled', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.enableVerticalSwipes();
      expect(listener).toHaveBeenCalledTimes(1);

      confirmation.off('change:isVerticalSwipesEnabled', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.disableVerticalSwipes();
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});

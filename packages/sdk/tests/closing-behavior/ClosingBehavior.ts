import { describe, expect, it, vi } from 'vitest';

import { ClosingBehavior } from '~/closing-behavior/index.js';

describe('disable', () => {
  it('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to false', () => {
    const postEvent = vi.fn();
    const confirmation = new ClosingBehavior(true, postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    confirmation.disableConfirmation();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: false });
  });

  it('should emit "isConfirmationNeededChanged" event with false value', () => {
    const confirmation = new ClosingBehavior(true, vi.fn());
    const listener = vi.fn();

    confirmation.on('change:isConfirmationNeeded', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    confirmation.disableConfirmation();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe('enable', () => {
  it('should call "web_app_setup_closing_behavior" method with "need_confirmation" equal to true', () => {
    const postEvent = vi.fn();
    const confirmation = new ClosingBehavior(false, postEvent);

    expect(postEvent).toHaveBeenCalledTimes(0);
    confirmation.enableConfirmation();
    expect(postEvent).toHaveBeenCalledTimes(1);
    expect(postEvent).toHaveBeenCalledWith('web_app_setup_closing_behavior', { need_confirmation: true });
  });

  it('should emit "isConfirmationNeededChanged" event with true value', () => {
    const confirmation = new ClosingBehavior(false, vi.fn());
    const listener = vi.fn();

    confirmation.on('change:isConfirmationNeeded', listener);
    expect(listener).toHaveBeenCalledTimes(0);
    confirmation.enableConfirmation();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
  });
});

describe('on', () => {
  describe('"isConfirmationNeededChanged" event', () => {
    it('should add event listener to event', () => {
      const listener = vi.fn();
      const confirmation = new ClosingBehavior(false, vi.fn());

      confirmation.on('change:isConfirmationNeeded', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.enableConfirmation();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});

describe('off', () => {
  describe('"isConfirmationNeededChanged" event', () => {
    it('should remove event listener from event', () => {
      const listener = vi.fn();
      const confirmation = new ClosingBehavior(false, vi.fn());

      confirmation.on('change:isConfirmationNeeded', listener);

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.enableConfirmation();
      expect(listener).toHaveBeenCalledTimes(1);

      confirmation.off('change:isConfirmationNeeded', listener);
      listener.mockClear();

      expect(listener).toHaveBeenCalledTimes(0);
      confirmation.disableConfirmation();
      expect(listener).toHaveBeenCalledTimes(0);
    });
  });
});
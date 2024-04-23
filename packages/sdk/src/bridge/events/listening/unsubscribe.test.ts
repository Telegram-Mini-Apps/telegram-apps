import { createWindow, type WindowSpy } from '@test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '@test-utils/dispatchWindowMessageEvent.js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { disposeMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';

import { subscribe } from './subscribe.js';
import { unsubscribe } from './unsubscribe.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockRestore();

  // We have to dispose event emitter as long as it is saved between tests and works improperly.
  disposeMiniAppsEventEmitter();
});

it('should remove listener', () => {
  const listener = vi.fn();
  const emit = () => dispatchWindowMessageEvent('viewport_changed', {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  });

  subscribe(listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe(listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});

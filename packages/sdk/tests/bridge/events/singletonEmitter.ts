import { afterEach, beforeEach, expect, it } from 'vitest';

import { singletonEmitter } from '~/bridge/events/singletonEmitter.js';
import { createWindow, WindowSpy } from '~test-utils/createWindow.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow({
    innerWidth: 1920,
    innerHeight: 1080,
  });
});

afterEach(() => {
  windowSpy.mockRestore();
});

it('should return the same instance of emitter', () => {
  expect(singletonEmitter()).toEqual(singletonEmitter());
});
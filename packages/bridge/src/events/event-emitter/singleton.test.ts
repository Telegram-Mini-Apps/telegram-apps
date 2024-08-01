import { afterEach, beforeEach, expect, it } from 'vitest';

import { createWindow } from '@test-utils/createWindow.js';
import type { WindowSpy } from '@test-utils/createWindow.js';

import { miniAppsEventEmitter } from './singleton.js';

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
  expect(miniAppsEventEmitter()).toEqual(miniAppsEventEmitter());
});

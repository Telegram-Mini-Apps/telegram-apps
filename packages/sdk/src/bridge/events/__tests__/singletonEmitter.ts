import { afterEach, beforeEach, expect, it } from 'vitest';

import type { WindowSpy } from '../../../../test-utils/createWindow';
import { createWindow } from '../../../../test-utils/createWindow';
import { singletonEmitter } from '../singletonEmitter';

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

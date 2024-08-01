import { mockWindow } from 'test-utils';
import { expect, it, vi } from 'vitest';

import { onWindow } from './onWindow.js';

it('should add event listener using window.addEventListener', () => {
  const addEventListener = vi.fn();
  const listener = vi.fn();
  mockWindow(() => ({ addEventListener }) as any);
  onWindow('message', listener);

  expect(addEventListener).toHaveBeenCalledWith('message', listener, undefined);
});

it('should return function which calls window.removeEventListener with arguments specified initially', () => {
  const removeEventListener = vi.fn();
  const listener = vi.fn();
  mockWindow(() => ({
    addEventListener: vi.fn(),
    removeEventListener,
  }) as any);
  onWindow('message', listener)();

  expect(removeEventListener).toHaveBeenCalledWith('message', listener, undefined);
});

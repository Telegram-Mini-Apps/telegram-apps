import { vi, expect, it } from 'vitest';
import { isSSR } from './isSSR.js';

it('should return true, if typeof window is undefined', () => {
  const spy = vi
    .spyOn(window, 'window', 'get')
    .mockImplementationOnce(() => undefined as any);
  expect(isSSR()).toBe(true);

  spy.mockImplementationOnce(() => ({}) as any);
  expect(isSSR()).toBe(false);
});

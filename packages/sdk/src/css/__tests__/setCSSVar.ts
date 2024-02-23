import { afterEach, expect, it, vi } from 'vitest';
import { setCSSVar } from '../setCSSVar';

afterEach(() => {
  vi.restoreAllMocks();
})

it('should call document.documentElement.style.setProperty with passed "name" and "value" arguments', () => {
  const spy = vi.spyOn(document.documentElement.style, 'setProperty').mockImplementation(() => {});

  setCSSVar('tma', 'is cool')
  expect(spy).toHaveBeenCalledOnce();
  expect(spy).toHaveBeenCalledWith('tma', 'is cool');
})
import { expect, vi, it } from 'vitest';
import { createCleanup } from '@/misc/createCleanup.js';

it('should call passed cleanup function if returned cleanup was called', () => {
  const [add, call] = createCleanup();
  const spy = vi.fn();
  add(spy);
  expect(spy).not.toHaveBeenCalled();
  call();
  expect(spy).toHaveBeenCalledOnce();
});

it('should call passed cleanup function if returned cleanup was called several times', () => {
  const [add, call] = createCleanup();
  const spy = vi.fn();
  add(spy);
  expect(spy).not.toHaveBeenCalled();
  call();
  expect(spy).toHaveBeenCalledOnce();
  call();
  expect(spy).toHaveBeenCalledOnce();
});

it('should not add cleanup function if returned cleanup was called',() => {
  const [add, call] = createCleanup();
  call();
  const spy = vi.fn();
  add(spy);
  expect(spy).not.toHaveBeenCalled();
  call();
  expect(spy).not.toHaveBeenCalled();
})

import { afterEach, expect, it, vi } from 'vitest';
import type { FnToSpy } from '@test-utils/types.js';

import { drop } from './drop.js';
import { go as goFn } from './go.js';

vi.mock('./go.js', () => ({ go: vi.fn() }));

function mockHistoryLength(length: number) {
  vi
    .spyOn(window.history, 'length', 'get')
    .mockImplementation(() => length);
}

function mockPushState(impl?: History['pushState']) {
  const spy = vi.spyOn(window.history, 'pushState');
  if (impl) {
    spy.mockImplementation(impl);
  }
}

const go = goFn as unknown as FnToSpy<typeof goFn>;

afterEach(() => {
  vi.restoreAllMocks();
});

it('should do nothing if history.length <= 1', () => {
  const pushStateSpy = vi.fn();
  mockPushState(pushStateSpy);

  mockHistoryLength(0);
  drop();
  expect(pushStateSpy).not.toHaveBeenCalled();

  mockHistoryLength(1);
  drop();
  expect(pushStateSpy).not.toHaveBeenCalled();
});

it('should push empty state', () => {
  const pushStateSpy = vi.fn();
  mockHistoryLength(2);
  mockPushState(pushStateSpy);

  drop();

  expect(pushStateSpy).toHaveBeenCalledOnce();
  expect(pushStateSpy).toHaveBeenCalledWith(null, '');
});

it('should call "go" function with value 1 - window.history.length', async () => {
  mockHistoryLength(10);
  mockPushState(vi.fn());

  go.mockImplementationOnce(async () => true);
  await drop();

  expect(go).toHaveBeenCalledOnce();
  expect(go).toHaveBeenCalledWith(-9);
});

it('should call "go" function until it returns true', async () => {
  mockHistoryLength(10);
  mockPushState(vi.fn());

  let count = 0;
  go.mockImplementation(async () => {
    count += 1;
    return count > 1 && count <= 4;
  });

  await drop();

  expect(go).toHaveBeenCalledTimes(5);
  expect(go).toHaveBeenNthCalledWith(1, -9);
  for (let i = 0; i < 4; i += 1) {
    expect(go).toHaveBeenNthCalledWith(i + 2, -1);
  }
});

import { afterEach, expect, it, vi } from 'vitest';

import { dropHistory } from './dropHistory.js';
import { historyGo as historyGoFn } from './historyGo.js';

vi.mock('./historyGo.js', () => ({ historyGo: vi.fn() }));

function mockHistoryLength(length: number) {
  vi
    .spyOn(window.history, 'length', 'get')
    .mockImplementation(() => length);
}

function mockPushState(impl?: History['pushState']) {
  const spy = vi.spyOn(window.history, 'pushState');
  impl && spy.mockImplementation(impl);
}

const historyGo = vi.mocked(historyGoFn);

afterEach(() => {
  vi.restoreAllMocks();
});

it('should do nothing if history.length <= 1', async () => {
  const pushStateSpy = vi.fn();
  mockPushState(pushStateSpy);

  mockHistoryLength(0);
  await dropHistory();
  expect(pushStateSpy).not.toHaveBeenCalled();

  mockHistoryLength(1);
  await dropHistory();
  expect(pushStateSpy).not.toHaveBeenCalled();
});

it('should push empty state', async () => {
  const pushStateSpy = vi.fn();
  mockHistoryLength(2);
  mockPushState(pushStateSpy);

  await dropHistory();

  expect(pushStateSpy).toHaveBeenCalledOnce();
  expect(pushStateSpy).toHaveBeenCalledWith(null, '');
});

it('should call "go" function with value 1 - window.history.length', async () => {
  mockHistoryLength(10);
  mockPushState(vi.fn());

  historyGo.mockImplementationOnce(() => Promise.resolve(true));
  await dropHistory();

  expect(historyGo).toHaveBeenCalledOnce();
  expect(historyGo).toHaveBeenCalledWith(-9);
});

it('should call "go" function until it returns true', async () => {
  mockHistoryLength(10);
  mockPushState(vi.fn());

  let count = 0;
  historyGo.mockImplementation(() => {
    count += 1;
    return Promise.resolve(count > 1 && count <= 4);
  });

  await dropHistory();

  expect(historyGo).toHaveBeenCalledTimes(5);
  expect(historyGo).toHaveBeenNthCalledWith(1, -9);
  for (let i = 0; i < 4; i += 1) {
    expect(historyGo).toHaveBeenNthCalledWith(i + 2, -1);
  }
});

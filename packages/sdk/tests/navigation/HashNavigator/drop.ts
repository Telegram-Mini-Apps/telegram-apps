import { afterEach, expect, it, vi } from 'vitest';

import { drop } from '~/navigation/HashNavigator/drop.js';

// TODO: Add more tests.

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

afterEach(() => {
  vi.restoreAllMocks();
});

it('should do nothing in case, history contains only 1 element', () => {
  const pushStateSpy = vi.fn();
  mockHistoryLength(1);
  mockPushState(pushStateSpy);

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
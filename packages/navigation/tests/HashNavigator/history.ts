import { describe, vi, it, afterEach, expect } from 'vitest';
import { drop, go } from '../../src/HashNavigator/history.js';

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

// TODO: Add more tests.

describe('go', () => {
  it('should return true if delta is 0', () => {
    expect(go(0)).resolves.toBe(true);
  });
});

describe('drop', () => {
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
});

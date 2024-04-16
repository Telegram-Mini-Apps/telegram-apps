import { afterEach, expect, it, vi } from 'vitest';

import { getFirstNavigationEntry } from './getFirstNavigationEntry.js';

afterEach(() => {
  vi.restoreAllMocks();
});

it('should return the first entry from the performance', () => {
  const expected = {};
  const spy = vi
    .spyOn(performance, 'getEntriesByType')
    .mockImplementationOnce(() => [expected] as any);

  expect(getFirstNavigationEntry()).toStrictEqual(expected);
  spy.mockClear().mockImplementation(() => []);

  expect(getFirstNavigationEntry()).toBeUndefined();
});

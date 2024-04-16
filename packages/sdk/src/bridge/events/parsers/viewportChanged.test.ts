import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { viewportChanged } from './viewportChanged.js';

const windowSpy = vi.spyOn(window, 'window', 'get');
// const innerWidth = 2000;

beforeEach(() => {
  windowSpy.mockImplementation(() => ({ innerWidth: 2000 }) as any);
});

afterEach(() => {
  windowSpy.mockRestore();
});

it('should return parsed value in case, passed value satisfies schema', () => {
  const values = [
    {
      height: 900,
      is_state_stable: true,
      is_expanded: true,
    },
    {
      width: null,
      height: 900,
      is_state_stable: true,
      is_expanded: true,
    },
    {
      height: 900,
      width: 100,
      is_state_stable: true,
      is_expanded: true,
    },
  ];

  values.forEach((value) => {
    const width = !value.width ? window.innerWidth : value.width;
    expect(viewportChanged().parse(value)).toStrictEqual({ ...value, width });
    expect(viewportChanged().parse(JSON.stringify(value))).toStrictEqual({
      ...value,
      width,
    });
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => viewportChanged().parse({})).toThrow();
});

import { expect, it, describe } from 'vitest';

import { formatItem } from './formatItem.js';

describe('item is string', () => {
  it('should return object with fields id, pathname = item and params = undefined', () => {
    expect(formatItem('bowl')).toStrictEqual({
      id: expect.anything(),
      pathname: 'bowl',
      params: undefined,
    });
  });

  it('should automatically generate id as hexadecimal numeric string if it is missing', () => {
    expect(parseInt(formatItem('bowl').id, 16))
      .not
      .toBeNaN();
  });
});

describe('item is object', () => {
  it('should return the same object', () => {
    expect(
      formatItem({
        pathname: 'bowl',
        id: 'id',
        params: { hash: '#juice' },
      }),
    ).toStrictEqual({
      pathname: 'bowl',
      id: 'id',
      params: { hash: '#juice' },
    });
  });

  it('should automatically generate id as hexadecimal numeric string if it is missing', () => {
    expect(parseInt(formatItem({ pathname: 'bowl' }).id, 16))
      .not
      .toBeNaN();
  });
});

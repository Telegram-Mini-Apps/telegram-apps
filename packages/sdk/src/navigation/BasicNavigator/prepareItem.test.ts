import { expect, it, describe } from 'vitest';
import { prepareItem } from '@/navigation/BasicNavigator/prepareItem.js';

describe('item is string', () => {
  it('should return object with fields id, pathname = item and params = undefined', () => {
    expect(prepareItem('bowl', '')).toStrictEqual({
      id: expect.anything(),
      pathname: 'bowl',
      params: undefined,
    });
  });

  it('should automatically generate id as hexadecimal numeric string if it is missing', () => {
    expect(parseInt(prepareItem('bowl', '').id, 16))
      .not
      .toBeNaN();
  });
});

describe('item is object', () => {
  it('should return the same object', () => {
    expect(
      prepareItem({
        pathname: 'bowl',
        id: 'id',
        params: { hash: '#juice' },
      }, ''),
    ).toStrictEqual({
      pathname: 'bowl',
      id: 'id',
      params: { hash: '#juice' },
    });
  });

  it('should automatically generate id as hexadecimal numeric string if it is missing', () => {
    expect(parseInt(prepareItem({ pathname: 'bowl' }, '').id, 16))
      .not
      .toBeNaN();
  });

  it('should fallback to the second argument, if pathname is missing', () => {
    expect(prepareItem({}, 'fallback').pathname).toBe('fallback');
  });
});

it('should return a frozen object', () => {
  expect(Object.isFrozen(prepareItem('', ''))).toBe(true);
})
import { describe, expect, it, vi } from 'vitest';
import * as TE from 'fp-ts/TaskEither';
import { BetterPromise } from 'better-promises';

import { CloudStorage } from '@/features/CloudStorage/CloudStorage.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testComponentMethodSafety } from '@test-utils/predefined/testComponentMethodSafety.js';
import { InvokeCustomMethodNoRequestIdFn } from '@/features/types.js';

const MIN_VERSION = '6.9';

function instantiate({
  version = MIN_VERSION,
  invokeCustomMethod = () => TE.right(undefined),
  isTma = true,
}: {
  version?: string;
  invokeCustomMethod?: InvokeCustomMethodNoRequestIdFn;
  isTma?: boolean;
} = {}) {
  return new CloudStorage({ version, invokeCustomMethod, isTma });
}

describe.each([
  ['deleteItem', (component: CloudStorage) => component.deleteItem('abc')],
  ['getItem', (component: CloudStorage) => component.getItem('abc')],
  ['getKeys', (component: CloudStorage) => component.getKeys()],
  ['setItem', (component: CloudStorage) => component.setItem('a', 'b')],
  ['clear', (component: CloudStorage) => component.clear()],
] as const)('%s', (method, tryCall) => {
  describe('safety', () => {
    testComponentMethodSafety({
      instantiate,
      get: instance => instance[method],
      try: tryCall,
      minVersion: MIN_VERSION,
    });
  });
});

describe('deleteItem', () => {
  it('should call invokeCustomMethod with "deleteStorageValues" and { keys }', async () => {
    const invokeCustomMethod = vi.fn(() => TE.right(undefined));
    await instantiate({ invokeCustomMethod }).deleteItem(['a', 'b']);
    expect(invokeCustomMethod).toHaveBeenCalledOnce();
    expect(invokeCustomMethod)
      .toHaveBeenCalledWith('deleteStorageValues', { keys: ['a', 'b'] }, undefined);
  });
});

describe('getItem', () => {
  it('should call invokeCustomMethod with "getStorageValues" and { keys }', async () => {
    const invokeCustomMethod = vi.fn(() => TE.right({ a: 'A', b: '' }));
    const component = instantiate({ invokeCustomMethod });
    await expect(component.getItem(['a', 'b'])).resolves.toStrictEqual({ a: 'A', b: '' });
    expect(invokeCustomMethod).toHaveBeenCalledOnce();
    expect(invokeCustomMethod).toHaveBeenCalledWith(
      'getStorageValues', { keys: ['a', 'b'] }, undefined,
    );

    await expect(component.getItem('a')).resolves.toBe('A');
    await expect(component.getItem('b')).resolves.toBe('');
  });
});

describe('getKeys', () => {
  it('should call invokeCustomMethod with "getStorageKeys" and {}', async () => {
    const invokeCustomMethod = vi.fn(() => TE.right(['a']));
    await expect(instantiate({ invokeCustomMethod }).getKeys()).resolves.toStrictEqual(['a']);
    expect(invokeCustomMethod).toHaveBeenCalledOnce();
    expect(invokeCustomMethod).toHaveBeenCalledWith('getStorageKeys', {}, undefined);
  });
});

describe('setItem', () => {
  it('should call invokeCustomMethod with "saveStorageValue" and { key, value }', async () => {
    const invokeCustomMethod = vi.fn(() => TE.right(undefined));
    await instantiate({ invokeCustomMethod }).setItem('a', 'b');
    expect(invokeCustomMethod).toHaveBeenCalledOnce();
    expect(invokeCustomMethod).toHaveBeenCalledWith(
      'saveStorageValue', { key: 'a', value: 'b' }, undefined,
    );
  });
});

describe('clear', () => {
  it('should call deleteItem to all keys returned by getKeys', async () => {
    const component = instantiate();

    const deleteItemSpy = vi
      .spyOn(component, 'deleteItem')
      .mockImplementation(() => BetterPromise.resolve());
    vi
      .spyOn(component, 'getKeys')
      .mockImplementation(() => BetterPromise.resolve(['a', 'b', 'c']));

    await component.clear();
    expect(deleteItemSpy).toHaveBeenCalledOnce();
    expect(deleteItemSpy).toHaveBeenCalledWith(['a', 'b', 'c']);
  });
});

describe('isSupported', () => {
  testIsSupported(version => instantiate({ isTma: true, version }), MIN_VERSION);
});

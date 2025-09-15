import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { type PostEventFpFn, type RequestFpFn, type EventName, emitEvent } from '@tma.js/bridge';
import { mockPageReload } from 'test-utils';

import { Biometry, type BiometryStorage } from '@/features/Biometry/Biometry.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { createNoopComponentStorage } from '@test-utils/utils.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testComponentMethodSafety } from '@test-utils/predefined/testComponentMethodSafety.js';

const MIN_VERSION = '7.2';

function instantiate({
  storage = false,
  version = MIN_VERSION,
  postEvent = () => E.right(undefined),
  request = ((_method: any, event: EventName) => {
    switch (event) {
      case 'biometry_auth_requested':
        return TE.right({ status: 'failed' });
      case 'biometry_info_received':
        return TE.right({
          available: true,
          access_requested: true,
          access_granted: true,
          device_id: 'A',
          token_saved: true,
          type: 'face',
        });
      case 'biometry_token_updated':
        return TE.right({ status: 'updated' });
      default:
        return TE.right(undefined);
    }
  }) as RequestFpFn,
  isTma = true,
}: {
  version?: string;
  storage?: boolean | BiometryStorage;
  postEvent?: PostEventFpFn;
  request?: RequestFpFn;
  isTma?: boolean;
} = {}) {
  return new Biometry({
    version,
    storage: typeof storage === 'boolean'
      ? storage
        ? createComponentSessionStorage('backButton')
        : createNoopComponentStorage()
      : storage,
    postEvent,
    request,
    isTma,
  });
}

describe.each([
  ['authenticate', (component: Biometry) => component.authenticate(), true],
  ['openSettings', (component: Biometry) => component.openSettings(), false],
  ['requestAccess', (component: Biometry) => component.requestAccess(), true],
  ['updateToken', (component: Biometry) => component.updateToken(), true],
  ['mount', (component: Biometry) => component.mount(), false],
] as const)('%s', (method, tryCall, requireMount) => {
  describe('safety', () => {
    testComponentMethodSafety({
      instantiate,
      get: instance => instance[method],
      try: tryCall,
      minVersion: MIN_VERSION,
      mount: requireMount
        ? component => component.mount()
        : undefined,
    });
  });
});

describe('mount', () => {
  it('should set isMounted = true', async () => {
    const component = instantiate();
    expect(component.isMounted()).toBe(false);
    await component.mount();
    expect(component.isMounted()).toBe(true);
  });

  describe('no page reload', () => {
    it('should not use value from the storage', async () => {
      const storageState = {
        available: true,
        type: 'face',
        accessGranted: true,
        accessRequested: true,
        deviceId: 'A',
        tokenSaved: true,
      };
      const get = vi.fn(() => storageState);
      const set = vi.fn();
      const component = instantiate({ storage: { get, set } });
      await component.mount();
      expect(get).not.toHaveBeenCalled();
      expect(set).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledWith(storageState);
    });
  });

  describe('page reload', () => {
    beforeEach(mockPageReload);

    it('should extract state from storage and save it again', async () => {
      const get = vi.fn();
      const set = vi.fn();
      const component = instantiate({
        request: () => TE.right({
          available: true,
          access_requested: true,
          access_granted: true,
          device_id: 'A',
          token_saved: true,
          type: 'face',
        }),
        storage: { get, set },
      });
      await component.mount();
      expect(get).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledWith({
        available: true,
        accessRequested: true,
        accessGranted: true,
        deviceId: 'A',
        tokenSaved: true,
        type: 'face',
      });

      const storageState = {
        available: true,
        type: 'face',
        accessGranted: true,
        accessRequested: true,
        deviceId: 'A',
        tokenSaved: true,
      };
      const get2 = vi.fn(() => storageState);
      const set2 = vi.fn();
      const component2 = instantiate({ storage: { get: get2, set: set2 } });
      await component2.mount();
      expect(get2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledWith(storageState);
    });
  });

  it(
    'should add "biometry_info_received" listener and update component state every time event was received',
    async () => {
      const component = instantiate({
        storage: {
          get: () => ({
            available: true,
            type: 'face',
            accessGranted: true,
            accessRequested: true,
            deviceId: 'A',
            tokenSaved: true,
          }),
          set: vi.fn(),
        },
      });
      await component.mount();
      expect(component.state()).toStrictEqual({
        available: true,
        type: 'face',
        accessGranted: true,
        accessRequested: true,
        deviceId: 'A',
        tokenSaved: true,
      });
      emitEvent('biometry_info_received', {
        available: true,
        access_requested: false,
        access_granted: false,
        device_id: 'B',
        token_saved: false,
        type: 'finger',
      });
      expect(component.state()).toStrictEqual({
        available: true,
        type: 'finger',
        accessGranted: false,
        accessRequested: false,
        deviceId: 'B',
        tokenSaved: false,
      });
    },
  );
});

describe('unmount', () => {
  it('should set isMounted = false', async () => {
    const component = instantiate();
    await component.mount();
    expect(component.isMounted()).toBe(true);
    component.unmount();
    expect(component.isMounted()).toBe(false);
  });

  it(
    'should remove "biometry_info_received" listener and stop updating component state every time event was received',
    async () => {
      const component = instantiate({
        storage: {
          get: () => ({
            available: true,
            type: 'face',
            accessGranted: true,
            accessRequested: true,
            deviceId: 'A',
            tokenSaved: true,
          }),
          set: vi.fn(),
        },
      });
      await component.mount();
      const mountedState = {
        available: true,
        type: 'face',
        accessGranted: true,
        accessRequested: true,
        deviceId: 'A',
        tokenSaved: true,
      };
      expect(component.state()).toStrictEqual(mountedState);
      component.unmount();
      emitEvent('biometry_info_received', {
        available: true,
        access_requested: false,
        access_granted: false,
        device_id: 'B',
        token_saved: false,
        type: 'finger',
      });
      expect(component.state()).toStrictEqual(mountedState);
    },
  );
});

describe('isSupported', () => {
  testIsSupported(version => instantiate({ isTma: true, version }), MIN_VERSION);
});

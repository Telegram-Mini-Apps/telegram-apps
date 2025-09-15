import { describe } from 'vitest';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { type PostEventFpFn, type RequestFpFn, type EventName } from '@tma.js/bridge';

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

describe('isSupported', () => {
  testIsSupported(version => instantiate({ isTma: true, version }), MIN_VERSION);
});

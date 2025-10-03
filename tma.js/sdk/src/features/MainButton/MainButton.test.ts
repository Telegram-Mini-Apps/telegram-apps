import { describe } from 'vitest';
import * as E from 'fp-ts/Either';
import { off, on } from '@tma.js/bridge';

import { MainButton, type MainButtonOptions } from '@/features/MainButton/MainButton.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { createNoopComponentStorage } from '@test-utils/utils.js';
import { testSafetyPure } from '@test-utils/predefined/testSafetyPure.js';
import { InstantiateOptions } from '@test-utils/types.js';

function instantiate({
  version = '6.0',
  storage = false,
  postEvent = () => E.right(undefined),
  isTma = true,
  onClick = (listener, once) => {
    return on('main_button_pressed', listener, once);
  },
  offClick = (listener, once) => {
    off('main_button_pressed', listener, once);
  },
  isPageReload = false,
  defaults = {
    bgColor: '#000000',
    textColor: '#ffffff',
  },
}: InstantiateOptions<MainButtonOptions> = {}) {
  return new MainButton({
    version,
    onClick,
    offClick,
    defaults,
    storage: typeof storage === 'boolean'
      ? storage
        ? createComponentSessionStorage('mainButton')
        : createNoopComponentStorage()
      : storage,
    postEvent,
    isTma,
    isPageReload,
  });
}

describe.each([
  ['setParams', (component: MainButton) => component.setParams({}), true],
  ['mount', (component: MainButton) => component.mount(), false],
  ['onClick', (component: MainButton) => component.onClick(() => undefined), false],
  ['offClick', (component: MainButton) => component.offClick(() => undefined), false],
] as const)('%s', (method, tryCall, requireMount) => {
  describe('safety', () => {
    testSafetyPure({
      instantiate,
      get: instance => instance[method],
      try: tryCall,
      mount: requireMount
        ? component => component.mount()
        : undefined,
    });
  });
});

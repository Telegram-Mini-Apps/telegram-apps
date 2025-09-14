import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as E from 'fp-ts/Either';
import type { PostEventFpFn } from '@tma.js/bridge';
import { mockPageReload } from 'test-utils';

import {
  ClosingBehavior,
  type ClosingBehaviorStorage,
} from '@/features/ClosingBehavior/ClosingBehavior.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { createNoopComponentStorage } from '@test-utils/utils.js';
import { testComponentMethodSafety } from '@test-utils/predefined/testComponentMethodSafety.js';

function instantiate({
  storage = false,
  postEvent = () => E.right(undefined),
  isTma = true,
}: {
  storage?: boolean | ClosingBehaviorStorage;
  postEvent?: PostEventFpFn;
  isTma?: boolean;
} = {}) {
  return new ClosingBehavior({
    storage: typeof storage === 'boolean'
      ? storage
        ? createComponentSessionStorage('closingBehavior')
        : createNoopComponentStorage()
      : storage,
    postEvent,
    isTma,
  });
}

describe.each([
  ['disableConfirmation', (component: ClosingBehavior) => component.disableConfirmation(), true],
  ['enableConfirmation', (component: ClosingBehavior) => component.enableConfirmation(), true],
  ['mount', (component: ClosingBehavior) => component.mount(), false],
] as const)('%s', (method, tryCall, requireMount) => {
  describe('safety', () => {
    testComponentMethodSafety({
      instantiate,
      get: instance => instance[method],
      try: tryCall,
      mount: requireMount
        ? component => component.mount()
        : undefined,
    });
  });
});

describe.each([
  ['disableConfirmation', false, 'enableConfirmation'],
  ['enableConfirmation', true, 'disableConfirmation'],
] as const)('%s', (method, targetValue, oppositeMethod) => {
  it(`should set isConfirmationEnabled = ${targetValue}`, () => {
    const component = instantiate();
    component.mount();
    component[oppositeMethod]();
    expect(component.isConfirmationEnabled()).toBe(!targetValue);
    component[method]();
    expect(component.isConfirmationEnabled()).toBe(targetValue);
  });

  it(
    `should call postEvent with "web_app_setup_closing_behavior" and { need_confirmation: ${targetValue} }`,
    () => {
      const postEvent = vi.fn(() => E.right(undefined));
      const component = instantiate({ postEvent });
      component.mount();
      component[oppositeMethod]();
      postEvent.mockClear();
      component[method]();
      component[method]();
      component[method]();
      expect(postEvent).toBeCalledTimes(1);
      expect(postEvent)
        .toBeCalledWith('web_app_setup_closing_behavior', { need_confirmation: targetValue });
    },
  );

  it('should save the state using passed storage', () => {
    const set = vi.fn();
    const component = instantiate({
      storage: { get: () => undefined, set },
    });
    component.mount();
    component[oppositeMethod]();
    set.mockClear();
    component[method]();
    expect(set).toHaveBeenCalledOnce();
    expect(set).toHaveBeenCalledWith({ isConfirmationEnabled: targetValue });
  });
});

describe('mount', () => {
  it('should set isMounted = true', () => {
    const component = instantiate();
    expect(component.isMounted()).toBe(false);
    component.mount();
    expect(component.isMounted()).toBe(true);
  });

  describe('no page reload', () => {
    it('should not use value from the storage', () => {
      const get = vi.fn(() => ({ isConfirmationEnabled: true }));
      const set = vi.fn();
      const component = instantiate({ storage: { get, set } });
      component.mount();
      expect(get).not.toHaveBeenCalled();
      expect(set).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledWith({ isConfirmationEnabled: false });
    });
  });

  describe('page reload', () => {
    beforeEach(mockPageReload);

    it('should extract state from storage and save it again', () => {
      const get = vi.fn();
      const set = vi.fn();
      const component = instantiate({ storage: { get, set } });
      component.mount();
      expect(get).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledWith({ isConfirmationEnabled: false });

      const get2 = vi.fn(() => ({ isConfirmationEnabled: true }));
      const set2 = vi.fn();
      const component2 = instantiate({ storage: { get: get2, set: set2 } });
      component2.mount();
      expect(get2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledWith({ isConfirmationEnabled: true });
    });
  });
});

describe('unmount', () => {
  it('should set isMounted = false', () => {
    const component = instantiate();
    expect(component.isMounted()).toBe(false);
    component.mount();
    expect(component.isMounted()).toBe(true);
    component.unmount();
    expect(component.isMounted()).toBe(false);
  });
});

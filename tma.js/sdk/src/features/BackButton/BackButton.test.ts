import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as E from 'fp-ts/Either';
import { type PostEventFpFn, emitEvent } from '@tma.js/bridge';
import { mockPageReload } from 'test-utils';

import { BackButton, type BackButtonStorage } from '@/features/BackButton/BackButton.js';
import { createComponentSessionStorage } from '@/component-storage.js';
import { createNoopComponentStorage } from '@test-utils/utils.js';
import { testIsSupported } from '@test-utils/predefined/testIsSupported.js';
import { testComponentMethodSafety } from '@test-utils/predefined/testComponentMethodSafety.js';

const MIN_VERSION = '6.1';

function instantiate({
  storage = false,
  version = MIN_VERSION,
  postEvent = () => E.right(undefined),
  isTma = true,
}: {
  version?: string;
  storage?: boolean | BackButtonStorage;
  postEvent?: PostEventFpFn;
  isTma?: boolean;
} = {}) {
  return new BackButton({
    version,
    storage: typeof storage === 'boolean'
      ? storage
        ? createComponentSessionStorage('backButton')
        : createNoopComponentStorage()
      : storage,
    postEvent,
    isTma,
  });
}

describe.each([
  ['hide', (component: BackButton) => component.hide(), true],
  ['show', (component: BackButton) => component.show(), true],
  ['mount', (component: BackButton) => component.mount(), false],
  ['onClick', (component: BackButton) => component.onClick(() => undefined), false],
  ['offClick', (component: BackButton) => component.offClick(() => undefined), false],
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

describe.each([
  ['hide', false, 'show'],
  ['show', true, 'hide'],
] as const)('%s', (method, targetIsVisible, oppositeMethod) => {
  it(`should set isVisible = ${targetIsVisible}`, () => {
    const component = instantiate();
    component.mount();
    component[oppositeMethod]();
    expect(component.isVisible()).toBe(!targetIsVisible);
    component[method]();
    expect(component.isVisible()).toBe(targetIsVisible);
  });

  it(
    `should call postEvent with "web_app_setup_back_button" and { is_visible: ${targetIsVisible} }`,
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
        .toBeCalledWith('web_app_setup_back_button', { is_visible: targetIsVisible });
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
    expect(set).toHaveBeenCalledWith({ isVisible: targetIsVisible });
  });
});

describe('onClick', () => {
  it('should call specified listener if "back_button_pressed" event was emitted', () => {
    const spy = vi.fn();
    instantiate().onClick(spy);
    emitEvent('back_button_pressed');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should call specified listener once if second argument = true', () => {
    const spy = vi.fn();
    instantiate().onClick(spy, true);
    emitEvent('back_button_pressed');
    emitEvent('back_button_pressed');
    emitEvent('back_button_pressed');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should stop calling specified listener if returned function was called', () => {
    const spy = vi.fn();
    const offClick = instantiate().onClick(spy, true);
    offClick();
    emitEvent('back_button_pressed');
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('offClick', () => {
  it('should stop calling specified listener', () => {
    const spy = vi.fn();
    const component = instantiate();
    component.onClick(spy);
    component.offClick(spy);
    emitEvent('back_button_pressed');
    expect(spy).not.toHaveBeenCalled();
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
      const get = vi.fn(() => ({ isVisible: true }));
      const set = vi.fn();
      const component = instantiate({ storage: { get, set } });
      component.mount();
      expect(get).not.toHaveBeenCalled();
      expect(set).toHaveBeenCalledOnce();
      expect(set).toHaveBeenCalledWith({ isVisible: false });
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
      expect(set).toHaveBeenCalledWith({ isVisible: false });

      const get2 = vi.fn(() => ({ isVisible: true }));
      const set2 = vi.fn();
      const component2 = instantiate({ storage: { get: get2, set: set2 } });
      component2.mount();
      expect(get2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledOnce();
      expect(set2).toHaveBeenCalledWith({ isVisible: true });
    });
  });
});

describe('unmount', () => {
  it('should set isMunted = false', () => {
    const component = instantiate();
    expect(component.isMounted()).toBe(false);
    component.mount();
    expect(component.isMounted()).toBe(true);
    component.unmount();
    expect(component.isMounted()).toBe(false);
  });
});

describe('isSupported', () => {
  testIsSupported(version => instantiate({ isTma: true, version }), MIN_VERSION);
});

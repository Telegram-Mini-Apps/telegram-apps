import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSessionStorageGetItem, mockSessionStorageSetItem } from 'test-utils';

import { mockPageReload } from '@test-utils/mockPageReload.js';
import { postEvent } from '@/components/globals.js';
import { resetMiniAppsEventEmitter } from '@/bridge/events/event-emitter/singleton.js';
import { emitMiniAppsEvent } from '@/bridge/events/event-handlers/emitMiniAppsEvent.js';
import { postEvent as defaultPostEvent } from '@/bridge/methods/postEvent.js';

import {
  text,
  textColor,
  isActive,
  isLoaderVisible,
  isVisible,
  state,
  backgroundColor,
  onClick,
  offClick,
  restore,
  setParams,
} from './mainButton.js';

beforeEach(() => {
  // Mock postEvent.
  postEvent.set(() => null);

  // Reset all signals.
  state.set({
    backgroundColor: '#000000',
    isActive: false,
    isLoaderVisible: false,
    isVisible: false,
    text: '',
    textColor: '#000000',
  });
  state.unsubAll();
  isVisible.unsubAll();

  // Reset mini apps event emitter and all mocks.
  resetMiniAppsEventEmitter();
  vi.restoreAllMocks();
});

afterEach(() => {
  // Reset postEvent.
  postEvent.set(defaultPostEvent);
});

describe.each([
  { signal: backgroundColor, name: 'backgroundColor' },
  { signal: isActive, name: 'isActive' },
  { signal: isLoaderVisible, name: 'isLoaderVisible' },
  { signal: isVisible, name: 'isVisible' },
  { signal: text, name: 'text' },
  { signal: textColor, name: 'textColor' },
] as const)('$name property', ({ signal, name }) => {
  beforeEach(() => {
    state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });
  });

  it(`should use "${name}" property from state`, () => {
    expect(signal()).toBe(state()[name]);
  });
});

describe('restore', () => {
  describe('page reload', () => {
    beforeEach(() => {
      mockPageReload();
    });

    it('should use value from session storage key "telegram-apps/main-button"', () => {
      const spy = vi.fn(() => JSON.stringify({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      }));
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/main-button');
      expect(state()).toStrictEqual({
        backgroundColor: '#123456',
        isActive: true,
        isLoaderVisible: true,
        isVisible: true,
        text: 'TEXT',
        textColor: '#789abc',
      });
    });

    it('should set initial value if session storage key "telegram-apps/main-button" not presented', () => {
      const spy = vi.fn(() => null);
      mockSessionStorageGetItem(spy);
      restore();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('telegram-apps/main-button');
      expect(state()).toStrictEqual({
        backgroundColor: '#000000',
        isActive: false,
        isLoaderVisible: false,
        isVisible: false,
        text: '',
        textColor: '#000000',
      });
    });
  });

  describe('first launch', () => {
    it('should set isVisible false', () => {
      restore();
      expect(isVisible()).toBe(false);
    });
  });
});

describe('onClick', () => {
  it('should add click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    emitMiniAppsEvent('main_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should remove added listener if returned function was called', () => {
    const fn = vi.fn();
    const off = onClick(fn);
    off();
    emitMiniAppsEvent('main_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('offClick', () => {
  it('should remove click listener', () => {
    const fn = vi.fn();
    onClick(fn);
    offClick(fn);
    emitMiniAppsEvent('back_button_pressed', {});
    expect(fn).toHaveBeenCalledTimes(0);
  });
});

describe('setParams', () => {
  it('should merge passed object with the state', () => {
    state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });

    setParams({
      backgroundColor: '#111111',
      isActive: false,
      isLoaderVisible: false,
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });

    expect(state()).toStrictEqual({
      backgroundColor: '#111111',
      isActive: false,
      isLoaderVisible: false,
      isVisible: true,
      text: 'TEXT UPDATED',
      textColor: '#000000',
    });
  });

  it('should save the state in storage key telegram-apps/main-button', () => {
    state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: 'TEXT',
      textColor: '#789abc',
    });

    const spy = mockSessionStorageSetItem();
    setParams({
      backgroundColor: '#111111',
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('telegram-apps/main-button', '{"backgroundColor":"#111111","isActive":true,"isLoaderVisible":true,"isVisible":true,"text":"TEXT","textColor":"#789abc"}');
  });

  it('should call web_app_setup_main_button only if text is not empty', () => {
    const spy = vi.fn(() => null);
    postEvent.set(spy);
    state.set({
      backgroundColor: '#123456',
      isActive: true,
      isLoaderVisible: true,
      isVisible: true,
      text: '',
      textColor: '#789abc',
    });
    setParams({ text: '' });

    expect(spy).toHaveBeenCalledTimes(0);
    setParams({ text: 'abc' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('web_app_setup_main_button', {
      is_visible: true,
      is_active: true,
      is_progress_visible: true,
      text: 'abc',
      color: '#123456',
      text_color: '#789abc',
    });
  });
});

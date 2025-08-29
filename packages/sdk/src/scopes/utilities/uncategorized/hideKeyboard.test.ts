import { beforeEach, describe, expect, it, vi } from 'vitest';

import { hideKeyboard } from '@/scopes/utilities/uncategorized/hideKeyboard.js';
import { testSafety } from '@test-utils/predefined/testSafety.js';
import {
  mockMiniAppsEnv,
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
} from '@test-utils/utils.js';

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(hideKeyboard, 'hideKeyboard', { minVersion: '9.1' });
});

describe('safe', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should call "web_app_hide_keyboard"', () => {
    const spy = mockPostEvent();
    void hideKeyboard();
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_hide_keyboard', undefined);
  });
});

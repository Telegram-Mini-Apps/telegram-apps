import { beforeEach, describe, vi, it, expect } from 'vitest';

import { testSafety } from '@test-utils/predefined/testSafety.js';
import { shareMessage } from '@/scopes/utilities/uncategorized/shareMessage.js';
import {
  mockMiniAppsEnv,
  mockPostEvent,
  resetPackageState,
  setMaxVersion,
} from '@test-utils/utils.js';
import { emitEvent } from '@telegram-apps/bridge';
import { ShareMessageError } from '@/errors.js';

beforeEach(() => {
  vi.restoreAllMocks();
  resetPackageState();
  mockPostEvent();
});

describe('safety', () => {
  testSafety(shareMessage, 'shareMessage', { minVersion: '8.0' });
});

describe('safe', () => {
  beforeEach(() => {
    mockMiniAppsEnv();
    setMaxVersion();
  });

  it('should call "web_app_send_prepared_message" with id specified', () => {
    const spy = mockPostEvent();
    void shareMessage('ABC');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('web_app_send_prepared_message', { id: 'ABC' });
  });

  it('should resolve promise when "prepared_message_sent" event was received', async () => {
    const promise = shareMessage('ABC');
    emitEvent('prepared_message_sent');
    await expect(promise).resolves.toBeUndefined();
  });

  it('should reject promise when "prepared_message_failed" event was received', async () => {
    const promise = shareMessage('ABC');
    emitEvent('prepared_message_failed', { error: 'My custom error' });
    await expect(promise).rejects.toStrictEqual(new ShareMessageError('My custom error'));
  });
});
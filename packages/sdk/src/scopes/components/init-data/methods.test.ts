import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { InitData } from '@telegram-apps/bridge';

import { resetSignal } from '@test-utils/reset.js';

import { raw, state } from './signals.js';
import { restore } from './methods.js';


vi.mock('@telegram-apps/bridge', () => ({
  postEvent() {},
  retrieveLaunchParams: () => ({
    initData: {
      authDate: new Date(1000),
      canSendAfter: 60,
      chat: {
        id: 999,
        photoUrl: 'photo',
        type: 'group',
        title: 'Title',
      },
      chatType: 'sender',
      chatInstance: 'abc',
      hash: 'joke',
      queryId: 'query id',
      receiver: {
        id: 1000,
        photoUrl: 'receiver photo',
        firstName: 'a',
        lastName: 'b',
        username: 'c',
        isBot: false,
        isPremium: false,
        languageCode: 'en',
      },
      startParam: 'param',
      user: {
        id: 2000,
        photoUrl: 'user photo',
        firstName: 'a',
        lastName: 'b',
        username: 'c',
        languageCode: 'en',
      },
    } satisfies InitData,
    initDataRaw: 'data-set-in-the-test'
  }),
}));

beforeEach(() => {
  resetSignal(state);
});

describe('restore', () => {
  it('should set state based on init data from launch params', () => {
    restore();
    expect(state()).toStrictEqual({
      authDate: new Date(1000),
      canSendAfter: 60,
      chat: {
        id: 999,
        photoUrl: 'photo',
        type: 'group',
        title: 'Title',
      },
      chatType: 'sender',
      chatInstance: 'abc',
      hash: 'joke',
      queryId: 'query id',
      receiver: {
        id: 1000,
        photoUrl: 'receiver photo',
        firstName: 'a',
        lastName: 'b',
        username: 'c',
        isBot: false,
        isPremium: false,
        languageCode: 'en',
      },
      startParam: 'param',
      user: {
        id: 2000,
        photoUrl: 'user photo',
        firstName: 'a',
        lastName: 'b',
        username: 'c',
        languageCode: 'en',
      },
    });
    expect(raw()).toBe('data-set-in-the-test');
  });
});

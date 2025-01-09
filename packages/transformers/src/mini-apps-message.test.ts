import { describe, expect, it } from 'vitest';
import { is } from 'valibot';

import { MiniAppsMessage } from '@/mini-apps-message.js';

describe('MiniAppsMessage', () => {
  it('should properly parse the value', () => {
    expect(is(MiniAppsMessage, { eventType: 'WOW', eventData: 'something' })).toBe(true);
    expect(is(MiniAppsMessage, { eventType: 'WOW' })).toBe(true);
    expect(is(MiniAppsMessage, { eventType: 1 })).toBe(false);
  });
});

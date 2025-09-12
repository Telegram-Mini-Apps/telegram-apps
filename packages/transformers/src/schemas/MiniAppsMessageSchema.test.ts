import { expect, it } from 'vitest';
import { is } from 'valibot';

import { MiniAppsMessageSchema } from '@/schemas/MiniAppsMessageSchema.js';

it('should properly parse the value', () => {
  expect(is(MiniAppsMessageSchema, { eventType: 'WOW', eventData: 'something' })).toBe(true);
  expect(is(MiniAppsMessageSchema, { eventType: 'WOW' })).toBe(true);
  expect(is(MiniAppsMessageSchema, { eventType: 1 })).toBe(false);
});

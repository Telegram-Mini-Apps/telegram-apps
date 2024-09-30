import { expect, it } from 'vitest';

import { miniAppsMessage } from './miniAppsMessage.js';

it('should return object with keys eventType: string and eventData: unknown', () => {
  expect(miniAppsMessage()({
    eventType: 'WOW',
    eventData: 'something',
  })).toStrictEqual({
    eventType: 'WOW',
    eventData: 'something',
  });

  expect(miniAppsMessage()({
    eventType: 'WOW',
  })).toStrictEqual({
    eventType: 'WOW',
  });

  expect(miniAppsMessage()('{"eventType":"WOW"}')).toStrictEqual({
    eventType: 'WOW',
  });
});
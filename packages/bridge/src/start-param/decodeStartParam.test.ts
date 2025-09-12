import { it, expect } from 'vitest';

import { decodeStartParam } from './decodeStartParam.js';

it('should properly decode ASCII value', () => {
  expect(decodeStartParam('QUJDREVG')).toBe('ABCDEF');
});

it('should properly decode Unicode value', () => {
  expect(decodeStartParam('0KLQtdC70LXQs9GA0LDQvA==')).toBe('Телеграм');
});

it('should apply specified parser to the decoded value', () => {
  expect(
    decodeStartParam('0KLQtdC70LXQs9GA0LDQvA==', v => {
      return v === 'Телеграм' ? 'Телеграм Крута' : 'Телеграм Не Крута';
    }),
  ).toBe('Телеграм Крута');
});

it('should apply JSON.parse to the decoded value if the second argument is "json"', () => {
  expect(decodeStartParam('IlRlbGVncmFtIEtydXRhIg==', 'json')).toBe('Telegram Kruta');
});

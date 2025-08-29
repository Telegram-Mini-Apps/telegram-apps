import { it, expect, describe } from 'vitest';
import { right } from 'fp-ts/Either';

import { decodeStartParam, decodeStartParamFp } from './decodeStartParam.js';

describe('decodeStartParam', () => {
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
});

describe('decodeStartParamFp', () => {
  it('should properly decode ASCII value', () => {
    expect(decodeStartParamFp('QUJDREVG')).toMatchObject({ right: 'ABCDEF' });
  });

  it('should properly decode Unicode value', () => {
    expect(decodeStartParamFp('0KLQtdC70LXQs9GA0LDQvA==')).toMatchObject({ right: 'Телеграм' });
  });

  it('should apply specified parser to the decoded value', () => {
    expect(
      decodeStartParamFp('0KLQtdC70LXQs9GA0LDQvA==', v => {
        return right(v === 'Телеграм' ? 'Телеграм Крута' : 'Телеграм Не Крута');
      }),
    ).toMatchObject({ right: 'Телеграм Крута' });
  });

  it('should apply JSON.parse to the decoded value if the second argument is "json"', () => {
    expect(decodeStartParamFp('IlRlbGVncmFtIEtydXRhIg==', 'json')).toMatchObject({ right: 'Telegram Kruta' });
  });
});

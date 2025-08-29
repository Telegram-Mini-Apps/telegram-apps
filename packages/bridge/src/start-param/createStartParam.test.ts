import { describe, expect, it } from 'vitest';

import {
  createStartParam,
  createStartParamFp,
} from '@/start-param/createStartParam.js';

describe('createStartParam', () => {
  it('should return value\'s base64 representation if its length is less than 513', () => {
    expect(createStartParam('ABCDEF')).toBe('QUJDREVG');
  });

  it(
    'should return a base64 value based on the value\'s JSON.stringify representation if the value is not a string',
    () => {
      expect(createStartParam({ field: 'value' })).toBe('eyJmaWVsZCI6InZhbHVlIn0=');
    },
  );

  it('should throw if value\'s base64 representation length exceeds 512', () => {
    expect(() => createStartParam(new Array(385).fill('A').join('')))
      .toThrow('Value is too long for start parameter');
  });
});

describe('createStartParamFp', () => {
  it('should return value\'s base64 representation if its length is less than 513', () => {
    expect(createStartParamFp('ABCDEF')).toMatchObject({ right: 'QUJDREVG' });
  });

  it(
    'should return a base64 value based on the value\'s JSON.stringify representation if the value is not a string',
    () => {
      expect(createStartParamFp({ field: 'value' })).toMatchObject({ right: 'eyJmaWVsZCI6InZhbHVlIn0=' });
    },
  );

  it('should throw if value\'s base64 representation length exceeds 512', () => {
    expect(createStartParamFp(new Array(385).fill('A').join('')))
      .toMatchObject({ left: new Error('Value is too long for start parameter') });
  });
});

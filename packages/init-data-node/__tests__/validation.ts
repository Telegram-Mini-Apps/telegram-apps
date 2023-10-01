import { URLSearchParams } from 'url';
import { expect, test } from 'vitest';

import { validate } from '../src/index.js';

const sp = 'query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D&auth_date=1662771648&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2';
const secretToken = '5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8';

test('validation', () => {
  test('validate', () => {
    test('should throw missing hash error in case, it is not in search params', () => {
      expect(() => validate('auth_date=1', secretToken))
        .toThrowError('"hash" is empty or not found');
    });

    test('should throw an error on case, auth_date is not '
      + 'passed, equal to 0 or does not represent integer', () => {
      expect(() => validate('auth_date=0&hash=HHH', secretToken))
        .toThrowError('"auth_date" is empty or not found');
      expect(() => validate('hash=HHH', secretToken))
        .toThrowError('"auth_date" is empty or not found');
      expect(() => validate('auth_date=AAA&hash=HHH', secretToken))
        .toThrowError('"auth_date" should present integer');
    });

    test('should throw an error in case, parameters are expired', () => {
      expect(() => validate(sp, secretToken, {
        expiresIn: 1,
      })).toThrowError('Init data expired');
    });

    test('should throw an error in case, sign is invalid', () => {
      expect(() => validate(sp, `${secretToken}A`, {
        expiresIn: 0,
      })).toThrowError('Signature is invalid');
    });

    test('should correctly validate parameters in case, they are valid', () => {
      expect(() => validate(sp, secretToken, { expiresIn: 0 })).not.toThrow();
      expect(() => validate(new URLSearchParams(sp), secretToken, { expiresIn: 0 })).not.toThrow();
    });

    test('should throw an error in case, expiration time is '
      + 'not passed, parameters were created more than 1 day ago and '
      + 'already expired', () => {
      expect(() => validate(sp, secretToken)).toThrow('Init data expired');
    });
  });
});

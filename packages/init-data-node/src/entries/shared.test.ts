import { describe, expect, it } from 'vitest';
import { TypedError } from '@telegram-apps/toolkit';

import { isValid3rd, validate3rd } from './shared';

const sp = 'user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%20%2B%20-%20%3F%20%5C%2F%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%7D&chat_instance=8134722200314281151&chat_type=private&auth_date=1733584787&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ&hash=2174df5b000556d044f3f020384e879c8efcab55ddea2ced4eb752e93e7080d6';
const spOld = 'auth_date=1&chat_instance=8134722200314281151&chat_type=private&user=%7B%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22Vladislav+%2B+-+%3F+%2F%22%2C%22id%22%3A279058397%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22Kibenko%22%2C%22photo_url%22%3A%22https%3A%2F%2Ft.me%2Fi%2Fuserpic%2F320%2F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%22%2C%22username%22%3A%22vdkfrost%22%7D&signature=zL-ucjNyREiHDE8aihFwpfR9aggP2xiAo3NSpfe-p7IbCisNlDKlo7Kb6G4D0Ao2mBrSgEk4maLSdv6MLIlADQ&hash=b2e387ba89f433607d2492aad63bb04328b0f3d28585fd149617c8ef129566a2';
const spObject = new URLSearchParams(sp);
const botId = 7342037359;

describe('isValid3rd', () => {
  it('should return false if "signature" param is missing', async () => {
    await expect(isValid3rd('auth_date=1', botId)).resolves.toBe(false);
  });

  it('should return false if "auth_date" param is missing or does not represent integer', async () => {
    await expect(isValid3rd('hash=HHH', botId)).resolves.toBe(false);
    await expect(isValid3rd('auth_date=AAA&hash=HHH', botId)).resolves.toBe(false);
  });

  it('should return false if parameters are expired', async () => {
    await expect(isValid3rd(sp, botId, { expiresIn: 1 })).resolves.toBe(false);
  });

  it('should return false if sign is invalid', async () => {
    await expect(isValid3rd(sp, botId + 1, { expiresIn: 0 })).resolves.toBe(false);
  });

  it('should return true if init data is valid', async () => {
    const basicOptions = { expiresIn: 0 };
    await expect(isValid3rd(sp, botId, basicOptions)).resolves.toBe(true);
    await expect(isValid3rd(spObject, botId, basicOptions)).resolves.toBe(true);
  });

  it('should return false if "expiresIn" is not passed and parameters were created more than 1 day ago', async () => {
    await expect(isValid3rd(spOld, botId)).resolves.toBe(false);
  });
});

describe('validate3rd', () => {
  it('should throw missing hash error if "signature" param is missing', async () => {
    await expect(validate3rd('auth_date=1', botId)).rejects.toThrowError(
      new TypedError('ERR_SIGNATURE_MISSING', 'Signature is missing'),
    );
  });

  it('should throw if "auth_date" param is missing or does not represent integer', async () => {
    await expect(validate3rd('signature=HHH', botId)).rejects.toThrowError(
      new TypedError('ERR_AUTH_DATE_INVALID', 'Auth date is invalid'),
    );
    await expect(validate3rd('auth_date=AAA&signature=HHH', botId)).rejects.toThrowError(
      new TypedError('ERR_AUTH_DATE_INVALID', 'Auth date is invalid'),
    );
  });

  it('should throw if parameters are expired', async () => {
    await expect(validate3rd(sp, botId, { expiresIn: 1 })).rejects.toThrowError(
      new TypedError('ERR_EXPIRED', 'Init data is expired'),
    );
  });

  it('should throw if sign is invalid', async () => {
    await expect(validate3rd(sp, botId + 1, { expiresIn: 0 })).rejects.toThrowError(
      new TypedError('ERR_SIGN_INVALID', 'Sign is invalid'),
    );
  });

  it('should correctly validate parameters in case, they are valid', async () => {
    const basicOptions = { expiresIn: 0 };
    await expect(validate3rd(sp, botId, basicOptions)).resolves.toBeUndefined();
    await expect(validate3rd(spObject, botId, basicOptions)).resolves.toBeUndefined();
  });

  it('should throw if "expiresIn" is not passed and parameters were created more than 1 day ago', async () => {
    await expect(validate3rd(spOld, botId)).rejects.toThrow(
      new TypedError('ERR_EXPIRED', 'Init data is expired'),
    );
  });
});
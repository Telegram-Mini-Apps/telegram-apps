import { errorClass, errorClassWithData } from 'error-kid';

export const AuthDateInvalidError = errorClassWithData<
  { value: string | undefined },
  [value?: string]
>(
  'AuthDateInvalidError',
  value => ({ value }),
  value => [`"auth_date" is invalid: ${value || 'value is missing'}`],
);

export const SignatureInvalidError = errorClass('SignatureInvalidError');

export const HexStringLengthInvalidError = errorClass(
  'HexStringLengthInvalidError',
);

export const SignatureMissingError = errorClass<[thirdParty: boolean]>(
  'SignatureMissingError',
  thirdParty => [`"${thirdParty ? 'signature' : 'hash'}" parameter is missing`],
);

export const ExpiredError = errorClassWithData<
  { issuedAt: Date; expiresAt: Date },
  [issuedAt: Date, expiresAt: Date, now: Date]
>(
  'ExpiredError',
  (issuedAt, expiresAt) => ({ issuedAt, expiresAt }),
  (issuedAt, expiresAt, now) => [
    `Init data expired. Issued at ${issuedAt.toISOString()}, expires at ${expiresAt.toISOString()}, now is ${now.toISOString()}`,
  ],
);

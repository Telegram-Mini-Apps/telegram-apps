import { errorClass, errorClassWithData } from 'error-kid';

export class AuthDateInvalidError extends errorClassWithData<
  { value: string | undefined },
  [value?: string]
>(
  'AuthDateInvalidError',
  value => ({ value }),
  value => [`"auth_date" is invalid: ${value || 'value is missing'}`],
) {
}

export class SignatureInvalidError extends errorClass('SignatureInvalidError') {
}

export class HexStringLengthInvalidError extends errorClass(
  'HexStringLengthInvalidError',
) {
}

export class SignatureMissingError extends errorClass<[thirdParty: boolean]>(
  'SignatureMissingError',
  thirdParty => [`"${thirdParty ? 'signature' : 'hash'}" parameter is missing`],
) {
}

export class ExpiredError extends errorClassWithData<
  { issuedAt: Date; expiresAt: Date },
  [issuedAt: Date, expiresAt: Date, now: Date]
>(
  'ExpiredError',
  (issuedAt, expiresAt) => ({ issuedAt, expiresAt }),
  (issuedAt, expiresAt, now) => [
    `Init data expired. Issued at ${issuedAt.toISOString()}, expires at ${expiresAt.toISOString()}, now is ${now.toISOString()}`,
  ],
) {
}

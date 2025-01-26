import { errorClass, errorClassWithData } from 'error-kid';

export const [
  AuthDateInvalidError,
  isAuthDateInvalidError,
] = errorClassWithData<{ value: string | undefined }, [value?: string]>(
  'AuthDateInvalidError',
  value => ({ value }),
  value => [`"auth_date" is invalid: ${value || 'value is missing'}`],
);

export const [
  SignatureInvalidError,
  isSignatureInvalidError,
] = errorClass('SignatureInvalidError');

export const [
  SignatureMissingError,
  isSignatureMissingError,
] = errorClass<[thirdParty: boolean]>('SignatureMissingError', (thirdParty) => [
  `"${thirdParty ? 'signature' : 'hash'}" parameter is missing`,
]);

export const [
  ExpiredError,
  isExpiredError,
] = errorClassWithData<
  { issuedAt: Date; expiresAt: Date },
  [issuedAt: Date, expiresAt: Date, now: Date]
>(
  'ExpiredError',
  (issuedAt, expiresAt) => ({ issuedAt, expiresAt }),
  (issuedAt, expiresAt, now) => [
    `Init data expired. Issued at ${issuedAt.toISOString()}, expires at ${expiresAt.toISOString()}, now is ${now.toISOString()}`,
  ],
);
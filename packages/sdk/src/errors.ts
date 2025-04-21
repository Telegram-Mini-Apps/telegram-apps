import { errorClass } from 'error-kid';

function proxyMessage(message?: string): [string?] {
  return [message];
}

export const [
  CSSVarsBoundError,
  isCSSVarsBoundError,
] = errorClass('CSSVarsBoundError', 'CSS variables are already bound');

export const [
  NotAvailableError,
  isNotAvailableError,
] = errorClass<[message: string]>('NotAvailableError', proxyMessage);

export const [
  InvalidEnvError,
  isInvalidEnvError,
] = errorClass<[message?: string]>('InvalidEnvError', proxyMessage);

export const [
  FunctionUnavailableError,
  isFunctionNotAvailableError,
] = errorClass<[message?: string]>('FunctionNotAvailableError', proxyMessage);

export const [
  InvalidArgumentsError,
  isInvalidArguments,
] = errorClass<[message: string, cause?: unknown]>(
  'InvalidArgumentsError',
  (message, cause) => [message, { cause }],
);

export const [
  ConcurrentCallError,
  isConcurrentCallError,
] = errorClass<[message: string]>('ConcurrentCallError', proxyMessage);

export const [
  SetEmojiStatusError,
  isSetEmojiStatusError,
] = errorClass<[error: string]>(
  'SetEmojiStatusError',
  error => [`Failed to set emoji status: ${error}`],
);

export const [
  AccessDeniedError,
  isAccessDeniedError,
] = errorClass<[message: string]>('AccessDeniedError', proxyMessage);

export const [
  FullscreenFailedError,
  isFullscreenFailedError,
] = errorClass<[message: string]>('FullscreenFailedError', proxyMessage);

export const [
  ShareMessageError,
  isShareMessageError,
] = errorClass<[error: string]>('ShareMessageError', proxyMessage);

export const [
  UnknownThemeParamsKeyError,
  isUnknownThemeParamsKeyError,
] = errorClass<[key: string]>('UnknownThemeParamsKeyError', key => {
  return [`Unknown theme params key passed: ${key}`];
});
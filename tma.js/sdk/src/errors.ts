import { errorClass } from 'error-kid';

function msgToTuple(message?: string): [string?] {
  return [message];
}

export class CSSVarsBoundError extends errorClass(
  'CSSVarsBoundError',
  'CSS variables are already bound',
) {
}

export class NotAvailableError extends errorClass<[message: string]>(
  'NotAvailableError',
  msgToTuple,
) {
}

export class InvalidEnvError extends errorClass<[message?: string]>(
  'InvalidEnvError',
  msgToTuple,
) {
}

export class FunctionUnavailableError extends errorClass<[message?: string]>(
  'FunctionNotAvailableError',
  msgToTuple,
) {
}

export class InvalidArgumentsError extends errorClass<[message: string, cause?: unknown]>(
  'InvalidArgumentsError',
  (message, cause) => [message, { cause }],
) {
}

export class ConcurrentCallError extends errorClass<[message: string]>(
  'ConcurrentCallError',
  msgToTuple,
) {
}

export class SetEmojiStatusError extends errorClass<[error: string]>(
  'SetEmojiStatusError',
  error => [`Failed to set emoji status: ${error}`],
) {
}

export class AccessDeniedError extends errorClass<[message: string]>(
  'AccessDeniedError',
  msgToTuple,
) {
}

export class FullscreenFailedError extends errorClass<[message: string]>(
  'FullscreenFailedError',
  msgToTuple,
) {
}

export class ShareMessageError extends errorClass<[error: string]>(
  'ShareMessageError',
  msgToTuple,
) {
}

export class UnknownThemeParamsKeyError extends errorClass<[key: string]>(
  'UnknownThemeParamsKeyError',
  key => [`Unknown theme params key passed: ${key}`],
) {
}

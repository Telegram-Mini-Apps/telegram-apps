import { errorClass, errorClassWithData } from 'error-kid';
import type { Version } from '@telegram-apps/types';

export const [
  MethodUnsupportedError,
  isMethodUnsupportedError,
] = errorClass<[method: string, version: Version]>(
  'MethodUnsupportedError',
  (method, version) => [
    `Method "${method}" is unsupported in Mini Apps version ${version}`,
  ],
);

export const [
  MethodParameterUnsupportedError,
  isMethodMethodParameterUnsupportedError,
] = errorClass<[method: string, param: string, version: Version]>(
  'MethodParameterUnsupportedError',
  (method, param, version) => [
    `Parameter "${param}" of "${method}" method is unsupported in Mini Apps version ${version}`,
  ],
);

export const [
  LaunchParamsRetrieveError,
  isLaunchParamsRetrieveError,
] = errorClassWithData<
  { errors: [source: string, error: unknown][] },
  [[source: string, error: unknown][]]
>(
  'LaunchParamsRetrieveError',
  errors => ({ errors }),
  errors => [
    [
      'Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?',
      '📖 Refer to docs for more information:',
      'https://docs.telegram-mini-apps.com/packages/telegram-apps-bridge/environment',
      '',
      'Collected errors:',
      ...errors.map(([source, error]) => {
        return `Source: ${source} / ${error instanceof Error ? error.message : String(error)}`;
      }),
    ].join('\n'),
  ],
);

export const [
  InvalidLaunchParamsError,
  isInvalidLaunchParamsError,
] = errorClass<[string]>('InvalidLaunchParamsError', value => [
  `Invalid value for launch params: ${value}`,
]);

export const [UnknownEnvError, isUnknownEnvError] = errorClass('UnknownEnvError');

export const [
  InvokeCustomMethodError,
  isInvokeCustomMethodError,
] = errorClass<[error: string]>(
  'InvokeCustomMethodError',
  error => [`Server returned error: ${error}`],
);
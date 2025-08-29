export { encodeBase64Url } from '@/base64-url/encodeBase64Url.js';
export { decodeBase64Url } from '@/base64-url/decodeBase64Url.js';

export { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
export { isIframe } from '@/env/isIframe.js';
export { isTMA } from '@/env/isTMA.js';
export { mockTelegramEnv } from '@/env/mockTelegramEnv.js';

export type * from '@/events/types/index.js';
export { emitEvent } from '@/events/emitEvent.js';
export { on, off, offAll } from '@/events/emitter.js';
export type { EventListener, SubscribeListener } from '@/events/types/listening.js';

export {
  retrieveLaunchParams,
  type RetrieveLPResultCamelCased,
  type RetrieveLPResult,
} from '@/launch-params/retrieveLaunchParams.js';
export { retrieveRawLaunchParams } from '@/launch-params/retrieveRawLaunchParams.js';
export { retrieveRawInitData } from '@/launch-params/retrieveRawInitData.js';

export type * from '@/methods/types/index.js';
export { postMessage, postMessageImplementation, type PostMessage } from '@/methods/postMessage.js';
export { targetOrigin, setTargetOrigin } from '@/methods/targetOrigin.js';
export { captureSameReq } from '@/methods/captureSameReq.js';
export {
  createPostEvent,
  type OnUnsupportedFn,
  type CreatePostEventMode,
} from '@/methods/createPostEvent.js';
export { postEvent, type PostEventFn } from '@/methods/postEvent.js';
export { supports } from '@/methods/supports.js';

export { createStartParam } from '@/start-param/createStartParam.js';
export { decodeStartParam } from '@/start-param/decodeStartParam.js';
export { createStartParam, createStartParamFp } from '@/start-param/createStartParam.js';
export { isSafeToCreateStartParam } from '@/start-param/isSafeToCreateStartParam.js';

export { compareVersions } from '@/utils/compareVersions.js';
export {
  invokeCustomMethod,
  type InvokeCustomMethodOptions,
  type InvokeCustomMethodFn,
} from '@/utils/invokeCustomMethod.js';
export {
  request,
  type RequestCaptureEventsFn,
  type RequestCaptureEventFn,
  type RequestResult,
  type RequestCaptureFnEventsPayload,
  type RequestOptions,
  type RequestCaptureFn,
  type RequestFn,
} from '@/utils/request.js';

export { applyPolyfills } from '@/applyPolyfills.js';
export { setDebug } from '@/debug.js';
export {
  LaunchParamsRetrieveError,
  isLaunchParamsRetrieveError,
  MethodUnsupportedError,
  isMethodUnsupportedError,
  InvokeCustomMethodError,
  isInvokeCustomMethodError,
  MethodParameterUnsupportedError,
  isMethodMethodParameterUnsupportedError,
  UnknownEnvError,
  isUnknownEnvError,
  InvalidLaunchParamsError,
  isInvalidLaunchParamsError,
} from '@/errors.js';
export { logger } from '@/logger.js';
export { resetPackageState } from '@/resetPackageState.js';

export {
  createLogger,
  type LogLevel,
  type LoggerOptions,
  type Logger,
  type LoggerFn,
  type LoggerForceFn,
} from '@telegram-apps/toolkit';

export {
  isCancelledError,
  isTimeoutError,
  CancelledError,
  TimeoutError,
  AbortablePromise,
  ManualPromise,
} from 'better-promises';

export { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
export { isIframe } from '@/env/isIframe.js';
export { isTMA } from '@/env/isTMA.js';
export { mockTelegramEnv } from '@/env/mockTelegramEnv.js';

export { BridgeError } from '@/errors/BridgeError.js';
export {
  type ErrorType,
  ERR_TIMED_OUT,
  ERR_METHOD_UNSUPPORTED,
  ERR_METHOD_PARAMETER_UNSUPPORTED,
  ERR_INVOKE_CUSTOM_METHOD_RESPONSE,
  ERR_UNKNOWN_ENV,
} from '@/errors/errors.js';

export { defineEventHandlers } from '@/events/handling/defineEventHandlers.js';
export { removeEventHandlers } from '@/events/handling/removeEventHandlers.js';
export { on } from '@/events/listening/on.js';
export { off } from '@/events/listening/off.js';
export { subscribe } from '@/events/listening/subscribe.js';
export type { EventListener } from '@/events/listening/types.js';
export { unsubscribe } from '@/events/listening/unsubscribe.js';

export type * from '@/events/types/index.js';

export { retrieveLaunchParams } from '@/launch-params/retrieveLaunchParams.js';

export type * from '@/methods/types/index.js';
export { $targetOrigin } from '@/methods/$targetOrigin.js';
export { captureSameReq } from '@/methods/captureSameReq.js';
export {
  createPostEvent,
  type OnUnsupportedFn,
  type CreatePostEventMode,
} from '@/methods/createPostEvent.js';
export { postEvent, type PostEventFn } from '@/methods/postEvent.js';
export { supports } from '@/methods/supports.js';

export { compareVersions } from '@/utils/compareVersions.js';
export { invokeCustomMethod } from '@/utils/invokeCustomMethod.js';
export {
  request,
  type RequestCaptureEventsFn,
  type RequestCaptureEventFn,
  type RequestResult,
  type RequestCaptureFnEventsPayload,
  type RequestBasicOptions,
  type RequestCaptureFn,
  type RequestFn,
} from '@/utils/request.js';

export { $debug } from '@/debug.js';
export { resetPackageState } from '@/resetPackageState.js';
export type { ExecuteWithOptions, ExecuteWithPostEvent } from '@/types.js';

export type {
  Chat,
  ChatType,
  InitData,
  LaunchParams,
  Platform,
  RGB,
  RGBShort,
  ThemeParams,
  ThemeParamsKey,
  User,
  Version,
} from '@telegram-apps/types';

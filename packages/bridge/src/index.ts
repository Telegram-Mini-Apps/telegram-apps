export { hasWebviewProxy } from '@/env/hasWebviewProxy.js';
export { isIframe } from '@/env/isIframe.js';
export { isTMA } from '@/env/isTMA.js';
export { mockTelegramEnv } from '@/env/mockTelegramEnv.js';

export type * from '@/events/types/index.js';
export { emitMiniAppsEvent } from '@/events/emitMiniAppsEvent.js';
export { on, off, offAll } from '@/events/emitter.js';
export type { EventListener, SubscribeListener } from '@/events/types/listening.js';

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

export { setDebug } from '@/debug.js';
export {
  ERR_METHOD_UNSUPPORTED,
  ERR_METHOD_PARAMETER_UNSUPPORTED,
  ERR_CUSTOM_METHOD_ERR_RESPONSE,
  ERR_UNKNOWN_ENV,
  ERR_RETRIEVE_LP_FAILED,
} from '@/errors.js';
export { resetPackageState } from '@/resetPackageState.js';
export type { ExecuteWithOptions, ExecuteWithPostEvent } from '@/types.js';

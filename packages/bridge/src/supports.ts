import { compareVersions, type Version } from '@tma.js/utils';

import type {
  HasCheckSupportMethodParam,
  HasCheckSupportMethodName,
  MethodName,
  MethodParams,
  NonEmptyMethodName,
} from './methods/index.js';

function lessOrEqual(a: Version, b: Version): boolean {
  return compareVersions(a, b) <= 0;
}

/**
 * By specified method and parameters extracts properties which could be used by
 * supports function as TWA method parameter.
 * @param method - TWA method.
 * @param params - method parameters.
 */
export function detectSupportParams<M extends NonEmptyMethodName>(
  method: M,
  params: MethodParams<M>,
): HasCheckSupportMethodParam<HasCheckSupportMethodName>[] {
  if (method === 'web_app_open_link') {
    if ('try_instant_view' in params) {
      return ['try_instant_view'];
    }
  }

  if (method === 'web_app_set_header_color') {
    if ('color' in params) {
      return ['color'];
    }
  }

  return [];
}

/**
 * Returns true in case, passed parameter in specified method is supported.
 * @param method - method name
 * @param param - method parameter
 * @param inVersion - platform version.
 */
export function supports<M extends HasCheckSupportMethodName>(
  method: M,
  param: HasCheckSupportMethodParam<M>,
  inVersion: Version,
): boolean;
/**
 * Returns true in case, specified method is supported in passed version.
 * @param method - method name.
 * @param inVersion - platform version.
 */
export function supports(method: MethodName, inVersion: Version): boolean;
export function supports(
  method: MethodName,
  paramOrVersion: Version | string,
  inVersion?: string,
): boolean {
  // Method name, parameter, target version.
  if (typeof inVersion === 'string') {
    if (method === 'web_app_open_link') {
      if (paramOrVersion === 'try_instant_view') {
        return lessOrEqual('6.4', inVersion);
      }
    }

    if (method === 'web_app_set_header_color') {
      if (paramOrVersion === 'color') {
        return lessOrEqual('6.9', inVersion);
      }
    }
  }

  // Method name, target version.
  switch (method) {
    case 'web_app_open_tg_link':
    case 'web_app_open_invoice':
    case 'web_app_setup_back_button':
    case 'web_app_set_background_color':
    case 'web_app_set_header_color':
    case 'web_app_trigger_haptic_feedback':
      return lessOrEqual('6.1', paramOrVersion);
    case 'web_app_open_popup':
      return lessOrEqual('6.2', paramOrVersion);
    case 'web_app_close_scan_qr_popup':
    case 'web_app_open_scan_qr_popup':
    case 'web_app_read_text_from_clipboard':
      return lessOrEqual('6.4', paramOrVersion);
    case 'web_app_invoke_custom_method':
    case 'web_app_request_write_access':
    case 'web_app_request_phone':
      return lessOrEqual('6.9', paramOrVersion);
    case 'web_app_setup_settings_button':
      return lessOrEqual('6.10', paramOrVersion);
    default:
      return true;
  }
}

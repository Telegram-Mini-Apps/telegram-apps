import type {
  MiniAppsMethodName,
  MiniAppsMethodVersionedParams,
  MiniAppsMethodWithVersionedParams,
} from '../bridge/methods/index.js';
import {
  compareVersions,
  type Version,
} from '../version/index.js';

/**
 * Returns true if "a" version is less than or equal to "b" version.
 * @param a
 * @param b
 */
function versionLessOrEqual(a: Version, b: Version): boolean {
  return compareVersions(a, b) <= 0;
}

/**
 * Returns true in case, passed parameter in specified method is supported.
 * @param method - method name
 * @param param - method parameter
 * @param inVersion - platform version.
 */
export function supports<M extends MiniAppsMethodWithVersionedParams>(
  method: M,
  param: MiniAppsMethodVersionedParams<M>,
  inVersion: Version,
): boolean;

/**
 * Returns true in case, specified method is supported in passed version.
 * @param method - method name.
 * @param inVersion - platform version.
 */
export function supports(method: MiniAppsMethodName, inVersion: Version): boolean;

export function supports(
  method: MiniAppsMethodName,
  paramOrVersion: Version | string,
  inVersion?: string,
): boolean {
  // Method name, parameter, target version.
  if (typeof inVersion === 'string') {
    if (method === 'web_app_open_link') {
      if (paramOrVersion === 'try_instant_view') {
        return versionLessOrEqual('6.4', inVersion);
      }
    }

    if (method === 'web_app_set_header_color') {
      if (paramOrVersion === 'color') {
        return versionLessOrEqual('6.9', inVersion);
      }
    }
  }

  switch (method) {
    case 'web_app_open_tg_link':
    case 'web_app_open_invoice':
    case 'web_app_setup_back_button':
    case 'web_app_set_background_color':
    case 'web_app_set_header_color':
    case 'web_app_trigger_haptic_feedback':
      return versionLessOrEqual('6.1', paramOrVersion);
    case 'web_app_open_popup':
      return versionLessOrEqual('6.2', paramOrVersion);
    case 'web_app_close_scan_qr_popup':
    case 'web_app_open_scan_qr_popup':
    case 'web_app_read_text_from_clipboard':
      return versionLessOrEqual('6.4', paramOrVersion);
    case 'web_app_switch_inline_query':
      return versionLessOrEqual('6.7', paramOrVersion);
    case 'web_app_invoke_custom_method':
    case 'web_app_request_write_access':
    case 'web_app_request_phone':
      return versionLessOrEqual('6.9', paramOrVersion);
    case 'web_app_setup_settings_button':
      return versionLessOrEqual('6.10', paramOrVersion);
    default:
      return true;
  }
}

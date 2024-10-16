import type { Version } from '@telegram-apps/types';

import { compareVersions } from '@/utils/compareVersions.js';
import type {
  MethodName,
  MethodNameWithVersionedParams,
  MethodVersionedParams,
} from '@/methods/types/index.js';

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
export function supports<M extends MethodNameWithVersionedParams>(
  method: M,
  param: MethodVersionedParams<M>,
  inVersion: Version,
): boolean;

/**
 * Returns true in case, specified method is supported in a passed version.
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
        return versionLessOrEqual('6.4', inVersion);
      }
      if (paramOrVersion === 'try_browser') {
        return versionLessOrEqual('7.6', inVersion);
      }
    }

    if (method === 'web_app_set_header_color') {
      if (paramOrVersion === 'color') {
        return versionLessOrEqual('6.9', inVersion);
      }
    }

    if (method === 'web_app_close' && paramOrVersion === 'return_back') {
      return versionLessOrEqual('7.6', inVersion);
    }

    if (method === 'web_app_setup_main_button' && paramOrVersion === 'has_shine_effect') {
      return versionLessOrEqual('7.10', inVersion);
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
    case 'web_app_biometry_get_info':
    case 'web_app_biometry_open_settings':
    case 'web_app_biometry_request_access':
    case 'web_app_biometry_request_auth':
    case 'web_app_biometry_update_token':
      return versionLessOrEqual('7.2', paramOrVersion);
    case 'web_app_setup_swipe_behavior':
      return versionLessOrEqual('7.7', paramOrVersion);
    case 'web_app_share_to_story':
      return versionLessOrEqual('7.8', paramOrVersion);
    case 'web_app_setup_secondary_button':
    case 'web_app_set_bottom_bar_color':
      return versionLessOrEqual('7.10', paramOrVersion);
    default:
      return [
        'iframe_ready',
        'iframe_will_reload',
        'web_app_close',
        'web_app_data_send',
        'web_app_expand',
        'web_app_open_link',
        'web_app_ready',
        'web_app_request_theme',
        'web_app_request_viewport',
        'web_app_setup_main_button',
        'web_app_setup_closing_behavior',
      ].includes(method);
  }
}

import {PostEventName} from './posting';
import {compareVersions, Version} from '@twa.js/utils';

/**
 * Returns true in case, specified method is supported in passed version.
 * @param method - checked method.
 * @param inVersion - Web App version to check method support in.
 */
export function supports(method: PostEventName, inVersion: Version): boolean {
  switch (method) {
    case 'web_app_open_tg_link':
    case 'web_app_open_invoice':
    case 'web_app_setup_back_button':
    case 'web_app_set_background_color':
    case 'web_app_set_header_color':
    case 'web_app_trigger_haptic_feedback':
      return compareVersions('6.1', inVersion) <= 0;
    case 'web_app_open_popup':
      return compareVersions('6.2', inVersion) <= 0;
    case 'web_app_close_scan_qr_popup':
    case 'web_app_open_scan_qr_popup':
    case 'web_app_read_text_from_clipboard':
      return compareVersions('6.4', inVersion) <= 0;
    default:
      return true;
  }
}

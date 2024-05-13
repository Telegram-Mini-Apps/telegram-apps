import { request } from '@/bridge/utils/request.js';
import { hasWebviewProxy } from '@/env/hasWebviewProxy.js';

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 */
export async function isTMA(): Promise<boolean> {
  if (hasWebviewProxy(window)) {
    return true;
  }
  try {
    await request({ method: 'web_app_request_theme', event: 'theme_changed', timeout: 100 });
    return true;
  } catch (e) {
    return false;
  }
}

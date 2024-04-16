import { request } from '@/bridge/request.js';

/**
 * Returns true in case, current environment is Telegram Mini Apps.
 */
export async function isTMA(): Promise<boolean> {
  try {
    await request('web_app_request_theme', 'theme_changed', { timeout: 100 });
    return true;
  } catch (e) {
    return false;
  }
}

import { createSafeURL } from '@/navigation/utils/createSafeURL.js';
import type { URLLike } from '@/navigation/BrowserNavigator/types.js';

/**
 * Extracts pathname from the value.
 * @param value - source value.
 */
export function getPathname(value: string | Partial<URLLike>): string {
  return createSafeURL(value).pathname;
}

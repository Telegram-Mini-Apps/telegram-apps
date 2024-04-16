import type { Platform } from '@/types/platform.js';

/**
 * @returns True if specified platform has a stable viewport. Stable means not changing any time
 * soon.
 * @param platform - platform identifier.
 */
export function isStableViewportPlatform(platform: Platform): boolean {
  return ['macos', 'tdesktop', 'unigram', 'webk', 'weba'].includes(platform);
}

import { isAbsolute, resolve } from 'node:path';
import process from 'node:process';

/**
 * Converts specified absolute or relative path to absolute.
 * @param path - path to convert.
 */
export function toAbsolute(path: string): string {
  return isAbsolute(path) ? path : resolve(process.cwd(), path);
}

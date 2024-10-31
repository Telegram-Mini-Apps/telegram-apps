import { basename, resolve } from 'node:path';
import type { Stats } from 'node:fs';
import { create } from 'tar';

/**
 * Compresses specified directory.
 * @param directory - directory to compress.
 * @param include - should return true if the specified file must be included.
 */
export function compress(
  directory: string,
  include?: (path: string, stats: Stats) => boolean,
): Promise<Buffer> {
  const stream = create({
    gzip: true,
    filter: include
      ? (path, entry) => include(path, entry as Stats)
      : undefined,
    cwd: resolve(directory, '..'),
  }, [basename(directory)]);

  return new Promise((resolve, reject) => {
    let buffer = Buffer.from([]);
    stream.on('error', reject);
    stream.on('data', b => {
      buffer = Buffer.from([...buffer, ...b]);
    });
    stream.on('end', () => resolve(buffer));
  });
}
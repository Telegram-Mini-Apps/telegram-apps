import { existsSync, lstatSync, readdirSync, type Stats } from 'node:fs';
import { resolve } from 'node:path';

import { TypedError } from '@/errors/TypedError.js';
import { ERR_NOT_DIR } from '@/errors/errors.js';

type VisitFn = (path: string, stats: Stats) => boolean;

function _walkDir(path: string, onVisit: VisitFn) {
  const stats = lstatSync(path);

  onVisit(path, stats) && readdirSync(path).forEach((filename) => {
    const fPath = resolve(path, filename);
    const fStats = lstatSync(fPath);

    if (onVisit(fPath, fStats) && fStats.isDirectory()) {
      _walkDir(fPath, onVisit);
    }
  });
}

/**
 * Walks the directory and calls callbacks visiting any folder entities.
 * @param path
 * @param onVisit
 */
export function walkDir(path: string, onVisit: VisitFn) {
  path = resolve(path);

  if (!existsSync(path)) {
    throw new Error('Doesnt exist');
  }

  const stats = lstatSync(path);
  if (!stats.isDirectory()) {
    throw new TypedError(ERR_NOT_DIR, `"${path}" is not a directory`);
  }

  _walkDir(path, onVisit);
}
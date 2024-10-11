import { extname } from 'node:path';

import figureSet from 'figures';
import chalk from 'chalk';

import type { TreeDir, TreeItem } from './types.js';

const LINE_HAS_NEXT_NEIGHBOR = figureSet.lineUpDownRight; // ├
const LINE_PATH_LAST = figureSet.lineUpRightArc; // ╰
const LINE_HOR_PATH = figureSet.lineVertical; // │
const SPACE = ' ';

const icons = {
  '💅': ['.css', '.scss'],
  '𝓕': ['.woff', '.woff2', '.ttf', '.otf'],
};

function getIcon(ext: string): string | undefined {
  for (const icon in icons) {
    if (icons[icon as keyof typeof icons].includes(ext)) {
      return icon;
    }
  }
}

function computeIcon(type: 'dir' | 'file', ext: string): string {
  return type === 'dir' ? '📁' : getIcon(ext) || '📄';
}

/**
 * Computes the prefix which should be used in the tree item.
 * @param prefix - previous prefix.
 * @param depth - item depth.
 * @param hasNextNeighbor - does item have the next item.
 */
function computePrefix(prefix: string, depth: number, hasNextNeighbor: boolean): string {
  return [
    prefix,
    depth ? `${hasNextNeighbor ? LINE_HAS_NEXT_NEIGHBOR : LINE_PATH_LAST} ` : '',
  ].join('');
}

function renderNote(note: string): string {
  return chalk.italic.bold.grey(note);
}

/**
 * Recursively prints directory as an ASCII tree.
 * @param options - execution options.
 */
function _renderTree(options: {
  depth: number;
  dir: TreeDir;
  hasNextElem: boolean;
  prefix: string;
  suffix?(item: TreeItem): string;
}): string {
  const { dir, hasNextElem } = options;
  let { prefix, depth } = options;

  const result: string[] = [
    [
      computePrefix(prefix, depth, options.hasNextElem),
      computeIcon('dir', extname(dir.name).slice(1)),
      ` ${dir.name}`,
      'items' in dir
        ? (Object.keys(dir.items).length ? '' : renderNote(' (empty)'))
        : '',
    ].join(''),
  ];

  if (depth >= 1) {
    prefix += hasNextElem ? `${LINE_HOR_PATH} ` : `${SPACE} `;
  }
  depth += 1;

  'items' in dir && Object.values(dir.items).forEach((item, idx, arr) => {
    const itemHasNext = idx !== arr.length - 1;

    if (item.type === 'file') {
      result.push([
        computePrefix(prefix, depth, itemHasNext),
        computeIcon('file', extname(item.name).slice(1)),
        ` ${item.name}`,
        options.suffix?.(item) || '',
      ].join(''));
    } else {
      result.push(_renderTree({
        ...options,
        dir: item,
        prefix,
        depth,
        hasNextElem: itemHasNext,
      }));
    }
  });

  return result.join('\n');
}

/**
 * Recursively prints directory as an ASCII tree.
 * @param options - execution options.
 */
export function renderTree(options: {
  dir: TreeDir;
  suffix?(item: TreeItem): string;
}): string {
  return _renderTree({
    ...options,
    depth: 0,
    prefix: '',
    hasNextElem: false,
  });
}
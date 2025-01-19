import { _version } from '@/globals.js';

/**
 * Makes the package think that the package is initialized.
 */
export function setMaxVersion() {
  _version.set('100');
}
import { $version } from '@/scopes/globals.js';

/**
 * Makes the package think that the package is initialized.
 */
export function setMaxVersion() {
  $version.set('10');
}
import { $version } from '@/scopes/globals.js';

/**
 * Makes the package think that the package is initialized.
 */
export function setInitialized() {
  $version.set('10');
}
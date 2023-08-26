import { classNames } from '@twa.js/utils';

import styles from '../scss/global.module.scss';

/**
 * Appends class which applies default font settings.
 * @param classes
 */
export function withFont(...classes: unknown[]): string {
  return classNames(...classes, styles.font);
}

/**
 * Appends class which applies default css settings.
 * @param classes
 */
export function withDefault(...classes: unknown[]): string {
  return withFont(...classes, styles.noSelect);
}
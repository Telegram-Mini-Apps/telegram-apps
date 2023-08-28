import { classNames } from '@twa.js/utils';

import styles from './styles.module.scss';

/**
 * Appends class which applies default font settings.
 * @param classes - values accepted by classNames function.
 * @see classNames
 */
export function withFont(...classes: unknown[]): string {
  return classNames(...classes, styles.font);
}

/**
 * Appends class which disables user selection.
 * @param classes - values accepted by classNames function.
 * @see classNames
 */
export function withNoSelect(...classes: unknown[]): string {
  return classNames(...classes, styles.noSelect);
}

/**
 * Appends class which applies default css settings.
 * @param classes - values accepted by classNames function.
 * @see classNames
 */
export function withDefault(...classes: unknown[]): string {
  return withFont(...classes, withNoSelect());
}
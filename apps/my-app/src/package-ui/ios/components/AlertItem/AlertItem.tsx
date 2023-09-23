import { createMemo, JSX, ParentProps, splitProps } from 'solid-js';
import { mergeClassNames, classNames } from '@twa.js/utils';

import type { CreateClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as Required<AlertActionClasses>;

export type AlertActionClassName = 'root' | 'rootVariantPrimary' | 'rootVariantSecondary';

export type AlertActionClasses = CreateClasses<AlertActionClassName>;

export interface AlertActionProps extends ParentProps, Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title'>,
  WithClasses<AlertActionClasses> {
  text: string;
  variant?: 'primary' | 'secondary';
}

/**
 * @see https://www.figma.com/file/skT2zRtPpWWu603vK9mk1V/iOS-16-UI-Kit-for-Figma-(Community)?node-id=9%3A1317&mode=dev
 */
export function AlertItem(props: AlertActionProps) {
  const [, rootProps] = splitProps(props, ['text', 'variant', 'children']);
  const classes = createMemo(() => {
    const {
      root,
      rootVariantSecondary,
      rootVariantPrimary,
    } = mergeClassNames(typedStyles, props.classes, { root: props.class });
    const variant = props.variant || 'primary';

    return {
      root: classNames(root, {
        [rootVariantPrimary]: variant === 'primary',
        [rootVariantSecondary]: variant === 'secondary',
      }),
    };
  });

  return (
    <div {...rootProps} class={classes().root}>
      {props.text}
    </div>
  );
}
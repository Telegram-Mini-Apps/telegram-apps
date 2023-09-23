import { createMemo, splitProps, type JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { mergeClassNames } from '@twa.js/utils';

import { withDefault } from '../../styles/index.js';

import type { CreateOptionalClasses, CreateRequiredClasses, WithClasses } from '../../../types.js';

import styles from './styles.module.scss';

const typedStyles = styles as CreateRequiredClasses<TypographyClassName | 'displayFont'>;

export type TypographyClassName =
  | 'root'
  | 'rootAlignCenter'
  | 'rootBold'
  | 'rootCaption1'
  | 'rootCaption2'
  | 'rootFootnote'
  | 'rootSubheadline'
  | 'rootCallout'
  | 'rootBody'
  | 'rootHeadline'
  | 'rootTitle1'
  | 'rootTitle2'
  | 'rootTitle3'
  | 'rootLargeTitle';

export type TypographyClasses = CreateOptionalClasses<TypographyClassName>;

export interface TypographyProps extends JSX.HTMLAttributes<HTMLParagraphElement>,
  WithClasses<TypographyClassName> {
  align?: 'center';
  /**
   * @default 'p'
   */
  as?: string;
  /**
   * @default false
   */
  bold?: boolean;
  /**
   * @default 'body'
   */
  variant?:
    | 'caption1'
    | 'caption2'
    | 'footnote'
    | 'subheadline'
    | 'callout'
    | 'body'
    | 'headline'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'large-title';
}

export function Typography(props: TypographyProps) {
  const classes = createMemo(() => {
    const {
      root,
      rootAlignCenter,
      rootBold,
      rootBody,
      rootCallout,
      rootCaption1,
      rootCaption2,
      rootFootnote,
      rootHeadline,
      rootLargeTitle,
      rootSubheadline,
      rootTitle1,
      rootTitle2,
      rootTitle3,
      displayFont,
      ...rest
    } = mergeClassNames(typedStyles, props.classes);
    const variant = props.variant || 'body';

    return {
      ...rest,
      root: withDefault(root, props.class, {
        [rootAlignCenter]: props.align === 'center',
        [rootCaption2]: variant === 'caption2',
        [rootCaption1]: variant === 'caption1',
        [rootFootnote]: variant === 'footnote',
        [rootSubheadline]: variant === 'subheadline',
        [rootCallout]: variant === 'callout',
        [rootBody]: variant === 'body',
        [rootHeadline]: variant === 'headline',
        [rootTitle3]: variant === 'title3',
        [rootTitle2]: variant === 'title2',
        [rootTitle1]: variant === 'title1',
        [rootLargeTitle]: variant === 'large-title',
        [rootBold]: props.bold,
        [displayFont]: variant === 'title3'
        || variant === 'title2'
        || variant === 'title1'
        || variant === 'large-title',
      }),
    };
  });

  const [, restProps] = splitProps(props, ['bold', 'variant', 'as']);

  return <Dynamic {...restProps} component={props.as || 'p'} class={classes().root} />;
}

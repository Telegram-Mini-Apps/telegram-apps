import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';

import type { WithOptionalClasses } from '~/styles/types.js';

/**
 * Quote component element keys allowed to be customized.
 */
export type QuoteElementKey = 'root' | 'icon';

/**
 * Quote component public properties.
 */
export interface QuoteProps
  extends JSXIntrinsicElementAttrs<'blockquote'>,
    WithConfig,
    WithOptionalClasses<QuoteElementKey, QuoteClassesProps> {
}

/**
 * Quote component properties passed to the classes hooks.
 */
export interface QuoteClassesProps extends QuoteProps {}

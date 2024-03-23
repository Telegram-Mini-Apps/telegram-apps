import type { WithConfig } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

/**
 * Quote component element keys allowed to be customized.
 */
export type QuoteElementKey = 'root' | 'icon';

/**
 * Quote component public properties.
 */
export interface QuoteProps
  extends JSXIntrinsicElementAttrs<'blockquote'>,
    WithOptionalClasses<QuoteElementKey, QuoteClassesProps>,
    WithConfig {
}

/**
 * Quote component properties passed to the classes hooks.
 */
export type QuoteClassesProps = QuoteProps;

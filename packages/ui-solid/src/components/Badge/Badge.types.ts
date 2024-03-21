import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

/**
 * Known Badge sizes.
 */
export type BadgeSize = 'dot' | 'sm' | 'lg';

/**
 * Known Badge variant.
 */
export type BadgeVariant = 'default' | 'critical' | 'secondary' | 'gray' | 'white';

/**
 * Component properties, having defaults.
 */
interface PropsWithDefaults extends WithComponentProps {
  /**
   * Badge size.
   * @default 'sm'
   */
  size?: BadgeSize;
  /**
   * Badge variant.
   * @default 'default'
   */
  variant?: BadgeVariant;
}

/**
 * Properties shared between classes and public component props.
 */
type SharedProps =
  & JSXIntrinsicElementAttrs<'span'>
  & PropsWithDefaults;

/**
 * Badge component element keys allowed to be customized.
 */
export type BadgeElementKey = 'root';

/**
 * Badge component properties passed to the classes hooks.
 */
export type BadgeClassesProps = RequiredBy<SharedProps, keyof PropsWithDefaults>;

/**
 * Badge component public properties.
 */
export type BadgeProps =
  & SharedProps
  & WithOptionalClasses<BadgeElementKey, BadgeClassesProps>;

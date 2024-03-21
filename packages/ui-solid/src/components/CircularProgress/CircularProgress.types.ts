import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

/**
 * Component properties, having defaults.
 */
interface PropsWithDefaults extends WithComponentProps {
  /**
   * Component size.
   * @default 'md'
   */
  size?: CircularProgressSize;
  /**
   * Current progress value.
   * @default 0
   */
  value?: number;
  /**
   * Maximum progress value. This value must be positive.
   * @default 1
   */
  max?: number;
}

/**
 * Allowed component size.
 */
export type CircularProgressSize = 'sm' | 'md' | 'lg';

/**
 * Properties shared between classes and public component props.
 */
type SharedProps =
  & JSXIntrinsicElementAttrs<'svg'>
  & PropsWithDefaults;

/**
 * CircularProgress component element keys allowed to be customized.
 */
export type CircularProgressElementKey = 'root' | 'background' | 'fill';

/**
 * CircularProgress component properties passed to the classes hooks.
 */
export type CircularProgressClassesProps = RequiredBy<SharedProps, keyof PropsWithDefaults>;

/**
 * CircularProgress component public properties.
 */
export type CircularProgressProps =
  & SharedProps
  & WithOptionalClasses<CircularProgressElementKey, CircularProgressClassesProps>;

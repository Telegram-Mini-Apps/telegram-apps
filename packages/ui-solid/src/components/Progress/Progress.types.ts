import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

/**
 * Component properties, having defaults.
 */
type PropsWithDefaults = WithComponentProps;

/**
 * Properties shared between classes and public component props.
 */
type SharedProps =
  & JSXIntrinsicElementAttrs<'progress'>
  & PropsWithDefaults;

/**
 * Progress component element keys allowed to be customized.
 */
export type ProgressElementKey = 'root';

/**
 * Progress component properties passed to the classes hooks.
 */
export type ProgressClassesProps = RequiredBy<SharedProps, keyof PropsWithDefaults>;

/**
 * Progress component public properties.
 */
export type ProgressProps =
  & SharedProps
  & WithOptionalClasses<ProgressElementKey, ProgressClassesProps>;

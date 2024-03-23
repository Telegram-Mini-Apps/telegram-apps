import type { WithConfig } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

/**
 * Component properties, having defaults.
 */
type PropsWithDefaults = WithConfig;

/**
 * Progress component element keys allowed to be customized.
 */
export type ProgressElementKey = 'root';

/**
 * Progress component public properties.
 */
export type ProgressProps =
  & PropsWithDefaults
  & JSXIntrinsicElementAttrs<'progress'>
  & WithOptionalClasses<ProgressElementKey, ProgressClassesProps>;

/**
 * Progress component properties passed to the classes hooks.
 */
export type ProgressClassesProps = ProgressProps & Required<PropsWithDefaults>;

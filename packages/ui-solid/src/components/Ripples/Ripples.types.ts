import type { ParentProps } from 'solid-js';

import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { WithComponentProp } from '~/types/components.js';
import type { JSXHTMLIntrinsicElement } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

/**
 * Component properties, having defaults.
 */
interface PropsWithDefaults extends WithComponentProps {
  /**
   * Places ripples in the center.
   * @default false
   */
  centered?: boolean;
  /**
   * Disables ripples.
   * @default false
   */
  disable?: boolean;
  /**
   * Places ripples over the component children.
   * @default false
   */
  overlay?: boolean;
}

/**
 * HTML tags allowed to be used as a root component.
 */
export type RipplesComponent = JSXHTMLIntrinsicElement;

/**
 * List of component element keys allowed to be modified.
 */
export type RipplesElementKey = 'root' | 'content' | 'ripples' | 'ripple';

/**
 * Properties shared between classes and public component props.
 */
type SharedProps<Cmp extends RipplesComponent> =
  & ParentProps<{
    /**
     * Ripple radius in pixels.
     * @default Half of the biggest container dimension.
     */
    radius?: number;
  }>
  & PropsWithDefaults
  & WithComponentProp<Cmp, 'div'>;

/**
 * Ripples component properties passed to the classes hooks.
 */
export type RipplesClassesProps<Cmp extends RipplesComponent> =
  & RequiredBy<SharedProps<Cmp>, keyof PropsWithDefaults>
  & WithOptionalClasses<RipplesElementKey, RipplesClassesProps<Cmp>>;

/**
 * Ripples component public properties.
 */
export type RipplesProps<Cmp extends RipplesComponent> =
  & SharedProps<Cmp>
  & WithOptionalClasses<RipplesElementKey, RipplesClassesProps<Cmp>>;

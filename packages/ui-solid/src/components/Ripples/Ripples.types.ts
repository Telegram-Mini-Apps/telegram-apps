import type { JSX, ParentProps } from 'solid-js';

import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { WithComponentProp } from '~/types/components.js';
import type { JSXHTMLIntrinsicElement } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

export type OnPointerDown = JSX.EventHandlerUnion<{
  getBoundingClientRect: () => DOMRect
}, PointerEvent>;

/**
 * HTML tags allowed to be used as a root component.
 */
export type RipplesComponent = JSXHTMLIntrinsicElement;

/**
 * List of component element keys allowed to be modified.
 */
export type RipplesElementKey = 'root' | 'content' | 'ripples' | 'ripple';

/**
 * List of components properties, which have defaults.
 */
export interface RipplesPropsDefaults extends WithComponentProps {
  /**
   * Places ripples in the center.
   * @default false
   */
  centered?: boolean;
  /**
   * Disables ripples.
   * @default false
   */
  disabled?: boolean;
  /**
   * Places ripples over the component children.
   * @default false
   */
  overlay?: boolean;
}

export interface RipplesStableProps extends ParentProps, RipplesPropsDefaults {
  /**
   * Ripple radius in pixels.
   * @default Half of the biggest container dimension.
   */
  radius?: number;
}

/**
 * Properties passed to the Ripples component class names computers.
 */
export type RipplesClassesProps<Cmp extends RipplesComponent> =
  & RequiredBy<RipplesStableProps, keyof RipplesPropsDefaults>
  & WithOptionalClasses<RipplesElementKey, RipplesClassesProps<Cmp>>
  & WithComponentProp<Cmp, 'div'>;

/**
 * Ripples component properties.
 */
export type RipplesProps<Cmp extends RipplesComponent> =
  & RipplesStableProps
  & WithOptionalClasses<RipplesElementKey, RipplesClassesProps<Cmp>>
  & WithComponentProp<Cmp, 'div'>;

import type { RGB } from '@tma.js/sdk';
import type { Component, JSX } from 'solid-js';

import type { WithComponentProps } from '~/components/types.js';
import type { WithOptionalClasses } from '~/styles/types.js';
import type { WithComponentProp } from '~/types/components.js';
import type { RequiredBy } from '~/types/utils.js';

export type OnPointerDown = JSX.EventHandlerUnion<{
  getBoundingClientRect: () => DOMRect
}, PointerEvent>;

/**
 * Type describing allowed "component" Ripples component property.
 */
export type RipplesComponent =
// Intrinsic elements supporting onPointerDown handler.
  {
    [Element in keyof JSX.IntrinsicElements]:
    OnPointerDown extends JSX.IntrinsicElements[Element]['onPointerDown']
      ? Element
      : never;
  }[keyof JSX.IntrinsicElements]
  | Component<{
  class?: string;
  onPointerDown?: OnPointerDown;
}>;

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
   * Ripple color.
   * @default '#ffffffb3'
   */
  color?: RGB | string;
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

/**
 * Properties passed to the Ripples component class names computers.
 */
export interface RipplesClassesProps
  extends RequiredBy<RipplesProps, keyof RipplesPropsDefaults | 'component'> {
}

/**
 * Ripples component properties.
 */
export type RipplesProps<Component extends RipplesComponent = 'div'> =
  & {
    /**
     * Ripple radius in pixels.
     * @default Half of the biggest container dimension.
     */
    radius?: number;
  }
  & RipplesPropsDefaults
  & WithOptionalClasses<RipplesElementKey, RipplesClassesProps>
  & WithComponentProp<Component, 'div'>;

import type { JSX } from 'solid-js';

import type { JSXIntrinsicElement, JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { WithConfig } from '~/types/known.js';
import type { PartialBy, RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

export type PointerEventHandler = JSX.EventHandler<HTMLElement, PointerEvent>;
export type TransitionEventHandler = JSX.EventHandlerUnion<HTMLSpanElement, TransitionEvent>;

type IntrinsicProps<Element extends JSXIntrinsicElement> =
  & WithConfig
  & RipplesDefaults
  & RipplesNoDefaults
  & { component: Element }
  & { [K in keyof JSXIntrinsicElementAttrs<Element>]: JSXIntrinsicElementAttrs<Element>[K] };

export interface RippleData {
  id: string;
  size: number;
  left: number;
  top: number;
}

/**
 * List of component element keys allowed to be modified.
 */
export type RipplesElementKey = 'root' | 'content' | 'ripples' | 'ripple';

/**
 * Component properties, having defaults.
 */
export interface RipplesDefaults {
  /**
   * Places ripples in the center.
   * @default false
   */
  centered?: boolean;
  /**
   * HTML tag to be used as a root element.
   * @default 'div'
   */
  component?: JSXIntrinsicElement;
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

interface RipplesNoDefaults {
  /**
   * Ripple radius in pixels.
   * @default Half of the biggest container dimension.
   */
  radius?: number;
}

/**
 * Properties of the component in case custom property "component" was passed.
 */
export type RipplesIntrinsicProps<Element extends JSXIntrinsicElement> =
  & IntrinsicProps<Element>
  & (
  WithOptionalClasses<
    RipplesElementKey,
    RequiredBy<IntrinsicProps<Element>, keyof RipplesDefaults>
  >
  );

/**
 * Ripples component default properties.
 */
export interface RipplesProps extends PartialBy<RipplesIntrinsicProps<'div'>, 'component'> {
}

/**
 * Ripples component properties passed to the classes hooks.
 */
export interface RipplesClassesProps extends RequiredBy<RipplesProps, keyof RipplesDefaults> {
}

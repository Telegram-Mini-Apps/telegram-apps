import type { Component, JSX, JSXElement } from 'solid-js';

import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { RequiredBy } from '~/types/utils.js';

import type { WithOptionalClasses } from '~/styles/types.js';

import type { WithConfig } from '~/components/types.js';

export type PointerEventHandler = JSX.EventHandler<HTMLElement, PointerEvent>;
export type TransitionEventHandler = JSX.EventHandlerUnion<HTMLSpanElement, TransitionEvent>;

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
 * Properties passed to the Ripples layout when using custom components.
 */
export interface LayoutProps {
  children?: JSXElement;
}

/**
 * Properties passed to the custom component.
 */
export interface RipplesComponentProps {
  /**
   * Computed class name.
   */
  class?: string;
  /**
   * Component which should be used by the custom component to render Ripples component core
   * layout.
   */
  Layout: Component<LayoutProps>;
  /**
   * Pointer down handler which is being used by the Ripples component to create a new ripple.
   */
  onPointerDown: PointerEventHandler;
  /**
   * Pointer leave handler which is being used by the Ripples component to remove a ripple.
   */
  onPointerLeave: PointerEventHandler;
}

/**
 * Ripples.Custom component properties.
 */
export interface RipplesCustomProps
  extends WithConfig,
    RipplesDefaults,
    RipplesNoDefaults,
    WithOptionalClasses<RipplesElementKey, RipplesCustomClassesProps> {
  /**
   * Component which should be rendered by the Ripples component.
   */
  component: Component<RipplesComponentProps>;
  class?: string;
}

/**
 * Ripples component properties passed to the classes hooks.
 */
export interface RipplesCustomClassesProps
  extends RequiredBy<RipplesCustomProps, keyof RipplesDefaults> {
}

/**
 * Ripples component public properties.
 */
export interface RipplesProps
  extends JSXIntrinsicElementAttrs<'div'>,
    WithConfig,
    RipplesDefaults,
    RipplesNoDefaults,
    WithOptionalClasses<RipplesElementKey, RipplesClassesProps> {
}

/**
 * Ripples component properties passed to the classes hooks.
 */
export interface RipplesClassesProps extends RequiredBy<RipplesProps, keyof RipplesDefaults> {
}

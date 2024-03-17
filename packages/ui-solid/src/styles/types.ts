export type ClassName = string | boolean | undefined | null;

export type ClassNameFn<Props> = (props: Props) => ClassName | ClassName[];

export type ClassesValue<Props> =
  | ClassName
  | ClassNameFn<Props>
  | (ClassName | ClassNameFn<Props>)[];

/**
 * Map, where key is an element key, and value is the generated class name or function, which
 * generates it.
 * @example
 * const classes = {
 *   root: 'my-loader'
 *   title: ['my-title', 'my-title--big'],
 *   description: undefined,
 *   body: (props) => 'body--${props.size}'
 *   footer: () => ['my-footer', null, 'my-footer--customized', undefined]
 * };
 *
 * const computed = {
 *   root: 'my-loader',
 *   title: 'my-title my-title--big',
 *   body: 'body--small',
 *   footer: 'my-footer my-footer--customized',
 * };
 */
export type Classes<ElementKey extends string, Props> = {
  [K in ElementKey]?: ClassesValue<Props>;
};

/**
 * Map, where key is an element key and value is according CSS class.
 */
export type ClassNamesMap<ElementKey extends string> = {
  [K in ElementKey]?: string;
};

/**
 * Mixin adding "classes" property, which is map with local and generated class names.
 */
export interface WithOptionalClasses<ElementKey extends string, Props> {
  /**
   * A map, where key refers to some component element, and value is something, describing
   * class computer.
   *
   * This property changes will not be tracked anywhere, so, its value should remain the same all
   * the time. Map values changes will also not be tracked by anything.
   *
   * To do dynamic class computations, it is allowed to use functions as values. These
   * functions will be wrapped into createMemo function and will be re-called only in case,
   * tracked properties changed.
   */
  classes?: Classes<ElementKey, Props>;
}

/**
 * Extracts classes map from the properties.
 */
export type ExtractPropsClasses<Props> = Props extends WithOptionalClasses<any, any>
  ? Exclude<Props['classes'], undefined>
  : never;

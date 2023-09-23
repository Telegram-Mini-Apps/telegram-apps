/**
 * Creates map, where key is local className name, and value is
 * the generated one.
 */
export type CreateClasses<ClassName extends string> = {
  [K in ClassName]?: string;
};

/**
 * Mixin adding "classes" property, which is map with local and generated class names.
 */
export interface WithClasses<T extends string> {
  classes?: CreateClasses<T>;
}
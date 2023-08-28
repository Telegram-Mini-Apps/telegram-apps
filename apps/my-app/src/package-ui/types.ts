/**
 * Creates map, where key is local className name, and value is
 * the generated one.
 */
export type CreateOptionalClasses<ClassName extends string> = {
  [K in ClassName]?: string;
};

/**
 * Same as CreateOptionalClasses but all fields are required.
 * @see CreateOptionalClasses
 */
export type CreateRequiredClasses<ClassName extends string> = Required<CreateOptionalClasses<ClassName>>;

/**
 * Mixin adding "classes" property, which is map with local and generated class names.
 */
export interface WithClasses<T extends string> {
  classes?: CreateOptionalClasses<T>;
}
import type { Parser } from './shared.js';

type IsEmptyFunc = (value: unknown) => boolean;
type GetDefaultFunc<T> = () => T;

// string().optional()
// <string>, <string | undefined>

// string().optional(v => v === null || v === undefined).default(() => 1000);
// <string>, <string | undefined>, <string | number>

export class ValueParser<Type> {
  /**
   * Parser used under the hood.
   * @private
   */
  #parser: Parser<Type>;

  /**
   * Is property optional. In case it is, parser will return undefined value if isEmpty
   * function returned true.
   * @private
   */
  #optional = false;

  /**
   * Should return true in case, passed value is recognized as empty.
   * @param value - checked value.
   * @private
   */
  #isEmpty: IsEmptyFunc = (value) => value === undefined;

  /**
   * Returns specified value in case value is recognized as empty.
   * @private
   */
  #getDefault?: GetDefaultFunc<any>;

  constructor(parser: Parser<Type>) {
    this.#parser = parser;
  }

  /**
   * Parses incoming value.
   * @param value - value to parse.
   */
  parse(value: unknown): Type {
    if (this.#optional && this.#isEmpty(value)) {
      return this.#getDefault ? this.#getDefault() : undefined as Type;
    }

    return this.#parser(value);
  }

  /**
   * Marks returned value as optional.
   * @param isEmpty - override previous isEmpty function.
   */
  optional(isEmpty?: IsEmptyFunc): ValueParser<Type | undefined> {
    this.#optional = true;

    if (isEmpty) {
      this.#isEmpty = isEmpty;
    }

    return this;
  }

  /**
   * Returns specified value in case, extracted value was empty.
   * @param getDefault - function to get default value.
   */
  default<Default>(getDefault: () => Default): ValueParser<Exclude<Type | Default, undefined>> {
    this.#getDefault = getDefault;

    return this as ValueParser<Exclude<Type | Default, undefined>>;
  }
}

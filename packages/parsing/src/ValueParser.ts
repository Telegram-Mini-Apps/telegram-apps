import type { Parser } from './shared.js';

type IsEmptyFunc = (value: unknown) => boolean;
type GetDefaultFunc<T> = () => T;

export class ValueParser<Type> {
  /**
   * Is property optional. In case it is, parser will return undefined value if isEmpty
   * function returned true.
   * @private
   */
  private isOptional = false;

  /**
   * Should return true in case, passed value is recognized as empty.
   * @param value - checked value.
   * @private
   */
  private isEmpty: IsEmptyFunc = (value) => value === undefined;

  /**
   * Returns specified value in case value is recognized as empty.
   * @private
   */
  private getDefault?: GetDefaultFunc<any>;

  constructor(private readonly parser: Parser<Type>) {
  }

  /**
   * Parses incoming value.
   * @param value - value to parse.
   */
  parse(value: unknown): Type {
    if (this.isOptional && this.isEmpty(value)) {
      return this.getDefault ? this.getDefault() : undefined as Type;
    }

    return this.parser(value);
  }

  /**
   * Marks returned value as optional.
   * @param isEmpty - override previous isEmpty function.
   */
  optional(isEmpty?: IsEmptyFunc): ValueParser<Type | undefined> {
    this.isOptional = true;

    if (isEmpty) {
      this.isEmpty = isEmpty;
    }

    return this;
  }

  /**
   * Returns specified value in case, extracted value was empty.
   * @param getDefault - function to get default value.
   */
  default<Default>(getDefault: () => Default): ValueParser<Exclude<Type | Default, undefined>> {
    this.getDefault = getDefault;

    return this as ValueParser<Exclude<Type | Default, undefined>>;
  }
}

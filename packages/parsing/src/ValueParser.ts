import type { HasUndefined, If } from '@twa.js/util-types';

import type { AllowedGetDefault, GetDefaultFunc, IsEmptyFunc, Parser } from './shared.js';

/**
 * Result of "parse" function in ValueParser.
 */
export type ParseResult<
  ResultType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> =
  | ResultType
  | If<
  HasUndefined<GetDefault>,
  If<
    IsOptional,
    undefined,
    never
  >,
  GetDefault extends GetDefaultFunc<infer Default> ? Default : never
>;

/**
 * Result of "optional" function in ValueParser.
 */
export type OptionalResult<BaseClass, ResultType, GetDefault extends AllowedGetDefault> =
  ValueParserType<BaseClass, ResultType, true, GetDefault>;

/**
 * Result of "default" function in ValueParser.
 */
export type DefaultResult<
  BaseClass,
  ResultType,
  IsOptional extends boolean,
  Default,
> = ValueParserType<BaseClass, ResultType, IsOptional, GetDefaultFunc<Default>>;

export interface ValueParserOverrides<
  BaseClass,
  ResultType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> {
  /**
   * Parses incoming value.
   * @param value - value to parse.
   */
  parse(value: unknown): ParseResult<ResultType, IsOptional, GetDefault>;

  /**
   * Marks the value as optional allowing parsing to return undefined value in
   * case value appeared to be empty.
   * @param isEmpty - function which returns true in case, value should be recognized as empty.
   */
  optional(isEmpty?: IsEmptyFunc): OptionalResult<BaseClass, ResultType, GetDefault>;

  /**
   * Sets function which returns value in case, it appeared to be empty.
   * @param getDefault - function which returns default value.
   */
  default<Default>(
    getDefault: GetDefaultFunc<Default>,
  ): DefaultResult<BaseClass, ResultType, IsOptional, Default>;
}

/**
 * Describes generated ValueParser interface.
 */
export type ValueParserType<
  BaseClass,
  ResultType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> = Omit<BaseClass, keyof ValueParserOverrides<any, any, any, any>>
  & ValueParserOverrides<BaseClass, ResultType, IsOptional, GetDefault>;

export class ValueParser<
  ResultType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> {
  /**
   * Creates ValueParser only with parser.
   * @param parser - data parser.
   */
  static create<ResultType>(parser: Parser<ResultType>): ValueParser<ResultType, false, undefined> {
    return new ValueParser(parser, false, undefined);
  }

  constructor(
    protected parser: Parser<ResultType>,
    private isOptional: IsOptional,
    private getDefault: GetDefault,
    private isEmpty: IsEmptyFunc = (value: unknown) => value === undefined,
  ) {
  }

  parse(value: unknown): ParseResult<ResultType, IsOptional, GetDefault> {
    if (this.isOptional && this.isEmpty(value)) {
      return this.getDefault ? this.getDefault() : undefined;
    }

    return this.parser(value);
  }

  optional(nextIsEmpty?: IsEmptyFunc): OptionalResult<this, ResultType, GetDefault> {
    this.isOptional = true as IsOptional;

    if (nextIsEmpty) {
      this.isEmpty = nextIsEmpty;
    }

    return this;
  }

  default<Default>(
    getDefault: GetDefaultFunc<Default>,
  ): DefaultResult<this, ResultType, IsOptional, Default> {
    this.getDefault = getDefault as any;

    return this as DefaultResult<this, ResultType, IsOptional, Default>;
  }
}

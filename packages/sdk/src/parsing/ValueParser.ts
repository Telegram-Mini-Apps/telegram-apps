import { ParseError } from './ParseError.js';
import type { Parser } from './types.js';
import type { If } from '../types/index.js';

/**
 * Result of "parse" function.
 */
export type ParseResult<ResultType, IsOptional extends boolean> =
  | ResultType
  | If<IsOptional, undefined, never>;

/**
 * Result of "optional" function in ValueParser.
 */
export type OptionalResult<BaseClass, ResultType> = ValueParserType<
BaseClass,
ResultType,
true
>;

export interface ValueParserOverrides<BaseClass, ResultType, IsOptional extends boolean> {
  /**
   * Parses incoming value applying parsing function passed via constructor.
   * @param value - value to parse.
   */
  parse(value: unknown): ParseResult<ResultType, IsOptional>;

  /**
   * Marks this parser result as optional. This makes the parser to check if passed value
   * is empty. If so, parser will return undefined value instead of passing it to the actual
   * parser.
   */
  optional(): OptionalResult<BaseClass, ResultType>;
}

/**
 * Describes generated ValueParser interface. Shortly saying, this type overrides BaseClass
 * properties defined in ValueParser.
 */
export type ValueParserType<BaseClass, ResultType, IsOptional extends boolean> =
  Omit<BaseClass, keyof ValueParserOverrides<any, any, any>>
  & ValueParserOverrides<BaseClass, ResultType, IsOptional>;

export class ValueParser<ResultType, IsOptional extends boolean> {
  constructor(
    protected parser: Parser<ResultType>,
    protected isOptional: IsOptional,
    protected type?: string,
  ) {
  }

  parse(value: unknown): ParseResult<ResultType, IsOptional> {
    // In case, parsing result is specified as optional, and passed value is considered as empty,
    // we can return undefined. Otherwise, pass to parser.
    if (this.isOptional && value === undefined) {
      return undefined as ParseResult<ResultType, IsOptional>;
    }

    try {
      return this.parser(value) as ParseResult<ResultType, IsOptional>;
    } catch (cause) {
      throw new ParseError(value, { type: this.type, cause });
    }
  }

  optional(): OptionalResult<this, ResultType> {
    this.isOptional = true as IsOptional;
    return this as OptionalResult<this, ResultType>;
  }
}

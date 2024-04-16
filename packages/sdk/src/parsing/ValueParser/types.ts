import type { If } from '@/types/logical.js';

/**
 * Result of "parse" function.
 */
export type ValueParserParseResult<ResultType, IsOptional extends boolean> =
  | ResultType
  | If<IsOptional, undefined, never>;

/**
 * Result of "optional" function in ValueParser.
 */
export type ValueParserOptionalResult<BaseClass, ResultType> = ValueParserType<
  BaseClass,
  ResultType,
  true
>;

export interface ValueParserOverrides<BaseClass, ResultType, IsOptional extends boolean> {
  /**
   * Parses incoming value applying parsing function passed via constructor.
   * @param value - value to parse.
   */
  parse(value: unknown): ValueParserParseResult<ResultType, IsOptional>;
  /**
   * Marks this parser result as optional. This makes the parser to check if passed value
   * is empty. If so, parser will return undefined value instead of passing it to the actual
   * parser.
   */
  optional(): ValueParserOptionalResult<BaseClass, ResultType>;
}

/**
 * Describes generated ValueParser interface. Shortly saying, this type overrides BaseClass
 * properties defined in ValueParser.
 */
export type ValueParserType<BaseClass, ResultType, IsOptional extends boolean> =
  Omit<BaseClass, keyof ValueParserOverrides<any, any, any>>
  & ValueParserOverrides<BaseClass, ResultType, IsOptional>;

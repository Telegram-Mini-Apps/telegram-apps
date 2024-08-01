import { createError } from '../errors/createError.js';
import { ERR_PARSE } from '../errors/errors.js';

import type { Parser } from '../types.js';
import type { ValueParserOptionalResult, ValueParserParseResult } from './types.js';

export class ValueParser<ResultType, IsOptional extends boolean> {
  constructor(
    protected parser: Parser<ResultType>,
    protected isOptional: IsOptional,
    protected type?: string,
  ) {
  }

  /**
   * Attempts to parse passed value
   * @param value - value to parse.
   * @throws {CustomError} ERR_PARSE
   * @see ERR_PARSE
   */
  parse(value: unknown): ValueParserParseResult<ResultType, IsOptional> {
    // In case, parsing result is specified as optional, and passed value is considered as empty,
    // we can return undefined. Otherwise, pass to parser.
    if (this.isOptional && value === undefined) {
      return undefined as ValueParserParseResult<ResultType, IsOptional>;
    }

    try {
      return this.parser(value) as ValueParserParseResult<ResultType, IsOptional>;
    } catch (cause) {
      throw createError(
        ERR_PARSE,
        `Unable to parse value${this.type ? ` as ${this.type}` : ''}`,
        cause,
      );
    }
  }

  optional(): ValueParserOptionalResult<this, ResultType> {
    this.isOptional = true as IsOptional;
    return this as ValueParserOptionalResult<this, ResultType>;
  }
}

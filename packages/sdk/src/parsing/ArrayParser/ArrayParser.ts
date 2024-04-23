import { createTypeError } from '../createTypeError.js';
import { ValueParser } from '../ValueParser/ValueParser.js';
import type { ArrayParserOfResult } from '../ArrayParser/types.js';
import type { AnyParser, Parser } from '../types.js';
import type { ValueParserParseResult } from '../ValueParser/types.js';

/**
 * Parses incoming value as array.
 * @param value - value to parse.
 */
function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const json = JSON.parse(value);

      if (Array.isArray(json)) {
        return json;
      }
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  }
  throw createTypeError();
}

export class ArrayParser<ItemType, IsOptional extends boolean>
  extends ValueParser<unknown[], IsOptional> {
  private itemParser: Parser<any>;

  constructor(
    itemParser: AnyParser<ItemType>,
    isOptional: IsOptional,
    type?: string,
  ) {
    super(parseArray, isOptional, type);

    this.itemParser = typeof itemParser === 'function'
      ? itemParser
      : itemParser.parse.bind(itemParser);
  }

  /**
   * Attempts to parse passed value
   * @param value - value to parse.
   * @throws {SDKError} ERROR_PARSE
   * @see ERROR_PARSE
   */
  override parse(value: unknown): ValueParserParseResult<ItemType[], IsOptional> {
    const arr = super.parse(value);
    return arr === undefined ? arr : arr.map(this.itemParser);
  }

  of<Item>(itemParser: AnyParser<Item>): ArrayParserOfResult<this, Item, IsOptional> {
    this.itemParser = typeof itemParser === 'function'
      ? itemParser
      : itemParser.parse.bind(itemParser);

    return this as ArrayParserOfResult<this, Item, IsOptional>;
  }
}

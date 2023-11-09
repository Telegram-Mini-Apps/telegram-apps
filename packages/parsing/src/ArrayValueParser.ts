import { ParsingError } from './ParsingError.js';
import { ValueParser } from './ValueParser.js';
import type { AnyParser, Parser, IsEmptyFunc } from './types.js';
import type { ValueParserOverrides, ParseResult } from './ValueParser.js';

export type OfResult<BaseClass, ItemType, IsOptional extends boolean> = ArrayParserType<
  BaseClass,
  ItemType,
  IsOptional
>;

export interface ArrayParserOverrides<
  BaseClass,
  ItemType,
  IsOptional extends boolean,
> extends ValueParserOverrides<BaseClass, ItemType[], IsOptional> {
  /**
   * Specifies parser for each array item.
   * @param parser - item parser.
   */
  of<Item>(parser: AnyParser<Item>): OfResult<BaseClass, Item, IsOptional>;
}

export type ArrayParserType<BaseClass, ItemType, IsOptional extends boolean> =
  Omit<BaseClass, keyof ArrayParserOverrides<any, any, any>>
  & ArrayParserOverrides<BaseClass, ItemType, IsOptional>;

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
  throw unexpectedTypeError();
}

export class ArrayValueParser<ItemType, IsOptional extends boolean>
  extends ValueParser<unknown[], IsOptional> {
  private itemParser: Parser<any>;

  constructor(itemParser: AnyParser<ItemType>, isOptional: IsOptional, isEmpty: IsEmptyFunc) {
    super(parseArray, isOptional, isEmpty);

    this.itemParser = typeof itemParser === 'function'
      ? itemParser
      : itemParser.parse.bind(itemParser);
  }

  override parse(value: unknown): ParseResult<ItemType[], IsOptional> {
    const arr = super.parse(value);
    return arr === undefined ? arr : arr.map(this.itemParser);
  }

  of<Item>(itemParser: AnyParser<Item>): OfResult<this, Item, IsOptional> {
    this.itemParser = typeof itemParser === 'function'
      ? itemParser
      : itemParser.parse.bind(itemParser);

    return this as OfResult<this, Item, IsOptional>;
  }
}

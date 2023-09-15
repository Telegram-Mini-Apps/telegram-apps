import { ValueParser } from './ValueParser.js';

import type { ValueParserOverrides } from './ValueParser.js';
import type { AnyParser, Parser, IsEmptyFunc, AllowedGetDefault } from './shared.js';

export type OfResult<
  BaseClass,
  ItemType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> = ArrayParserType<BaseClass, ItemType, IsOptional, GetDefault>;

export interface ArrayParserOverrides<
  BaseClass,
  ItemType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> extends ValueParserOverrides<BaseClass, ItemType[], IsOptional, GetDefault> {
  /**
   * Specifies parser for each array item.
   * @param parser - item parser.
   */
  of<Item>(parser: AnyParser<Item>): OfResult<BaseClass, Item, IsOptional, GetDefault>;
}

export type ArrayParserType<
  BaseClass,
  ItemType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> = Omit<BaseClass, keyof ArrayParserOverrides<any, any, any, any>>
  & ArrayParserOverrides<BaseClass, ItemType, IsOptional, GetDefault>;

/**
 * Parses incoming value as array.
 * @param value - value to parse.
 */
function parseArray(value: unknown): any[] {
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

  throw new Error(`Passed value does not satisfy any of known formats: ${JSON.stringify(value)}`);
}

/**
 * Wraps array parser around passed item parser.
 * @param parser - item parser.
 */
function withArrayParser<ItemType>(parser: AnyParser<ItemType>): Parser<ItemType[]> {
  const exactParser = typeof parser === 'function' ? parser : parser.parse.bind(parser);

  return (value) => parseArray(value).map(exactParser);
}

export class ArrayValueParser<
  ItemType,
  IsOptional extends boolean,
  GetDefault extends AllowedGetDefault,
> extends ValueParser<ItemType[], any, any> {
  constructor(
    itemParser: Parser<ItemType>,
    isOptional: IsOptional,
    getDefault: GetDefault,
    isEmpty: IsEmptyFunc = (value: unknown) => value === undefined,
  ) {
    super(withArrayParser(itemParser), isOptional, getDefault, isEmpty);
  }

  of<Item>(parser: AnyParser<Item>): OfResult<this, Item, IsOptional, GetDefault> {
    this.parser = withArrayParser(parser) as any;

    return this as unknown as OfResult<this, Item, IsOptional, GetDefault>;
  }
}

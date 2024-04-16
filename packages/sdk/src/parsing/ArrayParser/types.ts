import type { AnyParser } from '../types.js';
import type { ValueParserOverrides } from '../ValueParser/types.js';

export type ArrayParserOfResult<BaseClass, ItemType, IsOptional extends boolean> = ArrayParserType<
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
  of<Item>(parser: AnyParser<Item>): ArrayParserOfResult<BaseClass, Item, IsOptional>;
}

export type ArrayParserType<BaseClass, ItemType, IsOptional extends boolean> =
  Omit<BaseClass, keyof ArrayParserOverrides<any, any, any>>
  & ArrayParserOverrides<BaseClass, ItemType, IsOptional>;

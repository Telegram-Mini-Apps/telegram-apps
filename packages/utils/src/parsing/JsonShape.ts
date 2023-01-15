import {isRecord} from '../validation';
import {WithResultType} from './types';
import {getParserOptions} from './utils';
import {isRGB, RGB} from '../colors';

/**
 * Map which follows rule:
 * typeof TypeofMap[keyof TypeofMap] === keyof TypeofMap
 */
interface TypeofMap {
  string: string;
  number: number;
  boolean: boolean;
}

/**
 * Describes parser provided by CustomParser with all its variations.
 */
interface Parser<Schema, ResultType> {
  <From extends string>(
    from: From,
  ): JsonShape<Schema & WithResultType<From, ResultType>>;

  <From extends string>(
    from: From,
    optional: true,
  ): JsonShape<Schema & WithResultType<From, ResultType | undefined>>;

  <To extends string>(
    from: string,
    to: To,
  ): JsonShape<Schema & WithResultType<To, ResultType>>;

  <To extends string>(
    from: string,
    to: To,
    optional: true,
  ): JsonShape<Schema & WithResultType<To, ResultType | undefined>>;
}

/**
 * Shape which could be used to parse JSON structures.
 */
export class JsonShape<Schema> {
  private readonly parsers: [string, string, (value: unknown) => any][] = [];

  private createTypeOfParser<Type extends keyof TypeofMap>(
    type: Type,
  ): Parser<Schema, TypeofMap[Type]> {
    return ((from, toOrOptional, optional) => {
      const {to, isOptional} = getParserOptions(from, toOrOptional, optional);

      this.parsers.push([from, to, value => {
        if (value === undefined) {
          if (!isOptional) {
            throw new TypeError(`Unable to parse field "${from}". Value is empty.`);
          }
          return;
        }
        if (typeof value !== type) {
          throw new TypeError(
            `Unable to parse field "${from}" with ` +
            `value ${JSON.stringify(value)} as ${type}.`,
          );
        }
        return value;
      }])

      return this as any;
    }) as Parser<Schema, TypeofMap[Type]>;
  }

  /**
   * Adds parser for field of type boolean.
   */
  bool = this.createTypeOfParser('boolean');

  /**
   * Adds parser for field of type string.
   */
  string = this.createTypeOfParser('string');

  /**
   * Adds parser for field of type number.
   */
  number = this.createTypeOfParser('number');

  /**
   * Adds parser for field of type RGB.
   */
  rgb: Parser<Schema, RGB> = ((from, toOrOptional, optional) => {
    const {to, isOptional} = getParserOptions(from, toOrOptional, optional);

    this.parsers.push([from, to, value => {
      if (value === undefined) {
        if (!isOptional) {
          throw new TypeError(`Unable to parse field "${from}". Value is empty.`);
        }
        return;
      }
      if (typeof value !== 'string' || !isRGB(value)) {
        throw new TypeError(
          `Unable to parse field "${from}" with ` +
          `value ${JSON.stringify(value)} as RGB.`,
        );
      }
      return value;
    }])

    return this as any;
  }) as Parser<Schema, RGB>;

  /**
   * Parses incoming value.
   * @param value - value to parse.
   */
  parse(value: unknown): Schema {
    let json: any = value;

    // Convert value to JSON in case, it is string. We expect value to be
    // JSON string.
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        throw new TypeError('Value is not JSON object converted to string.');
      }
    }

    // We expect json to be usual object.
    if (!isRecord(json)) {
      throw new TypeError('Value is not JSON object.');
    }

    return this.parsers.reduce((acc, [from, to, parse]) => {
      const value = parse(json[from]);

      if (value !== undefined) {
        (acc as any)[to] = value;
      }
      return acc;
    }, {} as Schema);
  }
}

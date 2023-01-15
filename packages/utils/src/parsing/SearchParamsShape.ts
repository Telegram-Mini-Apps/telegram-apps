import {WithResultType} from './types';
import {getParserOptions} from './utils';

/**
 * Describes parser provided by CustomParser with all its variations.
 */
interface Parser<Schema, ResultType> {
  <From extends string>(
    from: From,
  ): SearchParamsShape<Schema & WithResultType<From, ResultType>>;

  <From extends string>(
    from: From,
    optional: true,
  ): SearchParamsShape<Schema & WithResultType<From, ResultType | undefined>>;

  <To extends string>(
    from: string,
    to: To,
  ): SearchParamsShape<Schema & WithResultType<To, ResultType>>;

  <To extends string>(
    from: string,
    to: To,
    optional: true,
  ): SearchParamsShape<Schema & WithResultType<To, ResultType | undefined>>;
}

/**
 * Describes definition of custom parser.
 */
interface CustomParser<Schema> {
  <From extends string, Parser extends { parse: (value: any) => any }>(
    from: From,
    parser: Parser,
  ): SearchParamsShape<Schema & WithResultType<From, ReturnType<Parser['parse']>>>;

  <From extends string, Parser extends { parse: (value: any) => any }>(
    from: From,
    parser: Parser,
    optional: true,
  ): SearchParamsShape<Schema & WithResultType<From, ReturnType<Parser['parse']> | undefined>>;

  <To extends string, Parser extends { parse: (value: any) => any }>(
    from: string,
    to: To,
    parser: Parser,
  ): SearchParamsShape<Schema & WithResultType<To, ReturnType<Parser['parse']>>>;

  <To extends string, Parser extends { parse: (value: any) => any }>(
    from: string,
    to: To,
    parser: Parser,
    optional: true,
  ): SearchParamsShape<Schema & WithResultType<To, ReturnType<Parser['parse']> | undefined>>;
}

/**
 * Shape which could be used to parse URL search params.
 */
export class SearchParamsShape<Schema> {
  private readonly parsers: [string, string, (value: string | null) => any][] = [];

  private createParser<ResultType>(
    parse: (from: string, value: string) => ResultType | undefined,
  ): Parser<Schema, ResultType> {
    return ((from, toOrOptional, optional) => {
      const {to, isOptional} = getParserOptions(from, toOrOptional, optional);

      this.parsers.push([from, to, value => {
        if (value === null) {
          if (!isOptional) {
            throw new TypeError(`Unable to parse field "${from}". Value is empty.`);
          }
          return;
        }
        return parse(from, value);
      }]);

      return this as any;
    }) as Parser<Schema, ResultType>;
  }

  /**
   * Adds custom parser for specified field.
   */
  custom: CustomParser<Schema> = ((
    from,
    toOrParser,
    parserOrOptional,
    optional,
  ) => {
    let to: string;
    let parser: { parse: (value: any) => any };
    let isOptional: boolean;

    if (typeof toOrParser === 'object') {
      to = from;
      parser = toOrParser;
      isOptional = !!parserOrOptional;
    } else {
      to = toOrParser;
      parser = parserOrOptional;
      isOptional = optional || false;
    }
    this.parsers.push([from, to, value => {
      if (value === null) {
        if (!isOptional) {
          throw new TypeError(`Unable to parse field "${from}". Value is empty.`);
        }
        return;
      }
      return parser.parse(value);
    }]);

    return this as any;
  }) as CustomParser<Schema>;

  /**
   * Adds parser for field of type Date.
   */
  date = this.createParser<Date>((from, value) => {
    if (value !== '') {
      const asInt = Number(value);
      const date = new Date(asInt.toString() === value ? asInt * 1000 : value);

      if (date.toString() !== 'Invalid Date') {
        return date;
      }
    }
    throw new TypeError(`Unable to parse value "${value}" as Date`);
  });

  /**
   * Adds parser for field of type string.
   */
  string = this.createParser<string>((_, value) => value);

  /**
   * Parses incoming value.
   * @param value - value to parse.
   */
  parse(value: string | URLSearchParams): Schema {
    if (value === undefined) {
      throw new TypeError('Value is empty.');
    }
    const params = typeof value === 'string'
      ? new URLSearchParams(value)
      : value;

    return this.parsers.reduce((acc, [from, to, parse]) => {
      const value = parse(params.get(from));

      if (value !== undefined) {
        (acc as any)[to] = value;
      }
      return acc;
    }, {} as Schema);
  }
}

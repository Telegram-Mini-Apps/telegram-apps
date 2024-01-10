import { describe, expect, it } from 'vitest';

import { ArrayValueParser } from '../ArrayValueParser';
import { string } from '../parsers';

describe('constructor', () => {
  it('should apply parser value directly if it is function', () => {
    const parser = new ArrayValueParser(() => 'Hello!', false);

    expect(parser.parse(['abc'])).toStrictEqual(['Hello!']);
  });

  it('should apply parser "parse" method directly if it is ValueParser', () => {
    const parser = new ArrayValueParser(string(), false);

    expect(parser.parse(['abc'])).toStrictEqual(['abc']);
  });
});

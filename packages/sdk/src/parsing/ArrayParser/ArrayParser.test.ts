import { describe, expect, it } from 'vitest';

import { string } from '../parsers/string.js';
import { ArrayParser } from './ArrayParser.js';

describe('constructor', () => {
  it('should apply parser value directly if it is function', () => {
    const parser = new ArrayParser(() => 'Hello!', false);

    expect(parser.parse(['abc'])).toStrictEqual(['Hello!']);
  });

  it('should apply parser "parse" method directly if it is ValueParser', () => {
    const parser = new ArrayParser(string(), false);

    expect(parser.parse(['abc'])).toStrictEqual(['abc']);
  });
});

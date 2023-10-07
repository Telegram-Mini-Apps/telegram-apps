import { describe, expect, it } from 'vitest';
import { ArrayValueParser, string } from '../src/index.js';

describe('ArrayValueParser.ts', () => {
  describe('ArrayValueParser', () => {
    describe('constructor', () => {
      it('should apply parser value directly if it is function', () => {
        const parser = new ArrayValueParser(
          () => 'Hello!',
          false,
          (value) => value === undefined,
        );

        expect(parser.parse(['abc'])).toStrictEqual(['Hello!']);
      });

      it('should apply parser "parse" method directly if it is ValueParser', () => {
        const parser = new ArrayValueParser(
          string(),
          false,
          (value) => value === undefined,
        );

        expect(parser.parse(['abc'])).toStrictEqual(['abc']);
      });
    });
  });
});

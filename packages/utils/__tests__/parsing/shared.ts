import { describe, expect, it, jest } from '@jest/globals';
import { schemaToParsers } from '../../src/parsing/shared';

describe('parsing', () => {
  describe('shared.ts', () => {
    describe('schemaToParsers', () => {
      it('should return element with parser specified as value '
        + 'for field in schema', () => {
        const fn = jest.fn();
        const knownParsers: Record<string, () => void> = {};
        expect(schemaToParsers({ field: fn }, knownParsers))
          .toContainEqual({
            optional: false,
            from: 'field',
            to: 'field',
            parser: fn,
          });
      });

      it('should return element with predefined parser from known '
        + 'parsers map', () => {
        const known = jest.fn();
        expect(schemaToParsers({ field: 'known' }, { known }))
          .toContainEqual({
            optional: false,
            from: 'field',
            to: 'field',
            parser: known,
          });
      });

      it('should return element with all options described in '
        + 'schema field', () => {
        const fn = jest.fn();
        const knownParsers: Record<string, () => void> = {};
        const items = schemaToParsers({
          a: {
            type: fn,
            optional: true,
            from: 'A',
          },
          b: { type: fn },
        }, knownParsers);

        expect(items).toContainEqual({
          optional: true,
          from: 'A',
          to: 'a',
          parser: fn,
        });
        expect(items).toContainEqual({
          optional: false,
          from: 'b',
          to: 'b',
          parser: fn,
        });
      });
    });
  });
});

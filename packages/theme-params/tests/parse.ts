import { describe, it, expect } from 'vitest';

import { parse } from '../src/index.js';

describe('parse.ts', () => {
  describe('parse', () => {
    const mapping = [
      ['bg_color', 'backgroundColor'],
      ['button_color', 'buttonColor'],
      ['button_text_color', 'buttonTextColor'],
      ['hint_color', 'hintColor'],
      ['link_color', 'linkColor'],
      ['secondary_bg_color', 'secondaryBackgroundColor'],
      ['text_color', 'textColor'],
    ];

    mapping.forEach(([from, to]) => {
      describe(to, () => {
        it(`should omit if "${from}" property is missing`, () => {
          expect(parse({})).toStrictEqual({});
        });

        it(`should throw if "${from}" property contains not a string in format "#RRGGBB"`, () => {
          expect(() => parse({ [from]: 999 })).toThrow();
        });

        it(`should map source "${from}" property to result "${to}" property if source contains string in format "#RRGGBB"`, () => {
          expect(parse({ [from]: '#aabbcc' })).toStrictEqual({ [to]: '#aabbcc' });
        });
      });
    });

    it('should correctly parse the entire value', () => {
      expect(parse({
        bg_color: '#ffaabb',
        button_color: '#233312',
        button_text_color: '#ddaa21',
        hint_color: '#da1122',
        link_color: '#22314a',
        text_color: '#31344a',
        secondary_bg_color: '#ffaabb',
      })).toStrictEqual({
        backgroundColor: '#ffaabb',
        buttonColor: '#233312',
        buttonTextColor: '#ddaa21',
        hintColor: '#da1122',
        linkColor: '#22314a',
        textColor: '#31344a',
        secondaryBackgroundColor: '#ffaabb',
      });
    });
  });
});

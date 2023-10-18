import { describe, it, expect } from 'vitest';

import { serialize } from '../src/index.js';

describe('serialize.ts', () => {
  describe('serialize', () => {
    const mapping = [
      ['backgroundColor', 'bg_color'],
      ['buttonColor', 'button_color'],
      ['buttonTextColor', 'button_text_color'],
      ['hintColor', 'hint_color'],
      ['linkColor', 'link_color'],
      ['secondaryBackgroundColor', 'secondary_bg_color'],
      ['textColor', 'text_color'],
    ];

    mapping.forEach(([from, to]) => {
      describe(to, () => {
        it(`should be omitted if "${from}" property is missing`, () => {
          expect(serialize({})).not.toMatch(`"${to}"`);
        });

        it(`should map source "${from}" property to result "${to}" property`, () => {
          expect(serialize({ [from]: '#aabbcc' })).toBe(`{"${to}":"#aabbcc"}`);
        });
      });
    });

    it('should correctly parse the entire value', () => {
      expect(serialize({
        backgroundColor: '#ffaabb',
        buttonColor: '#233312',
        buttonTextColor: '#ddaa21',
        hintColor: '#da1122',
        linkColor: '#22314a',
        secondaryBackgroundColor: '#ffaabb',
        textColor: '#31344a',
      })).toBe('{"bg_color":"#ffaabb","button_color":"#233312","button_text_color":"#ddaa21","hint_color":"#da1122","link_color":"#22314a","secondary_bg_color":"#ffaabb","text_color":"#31344a"}');
    });
  });
});

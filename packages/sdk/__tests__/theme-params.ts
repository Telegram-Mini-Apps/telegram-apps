import { expect, test } from 'vitest';

import { parseThemeParams } from '../src/index.js';

test('theme-params.ts', () => {
  test('parseThemeParams', () => {
    const fields = `"${[
      'backgroundColor', 'buttonColor', 'buttonTextColor', 'hintColor',
      'linkColor', 'textColor',
    ].join('", "')}"`;

   test(`should return object with fields ${fields} in case, passed value satisfies required schema`, () => {
      const value1 = {
        bg_color: '#ffaabb',
        button_color: '#233312',
        button_text_color: '#ddaa21',
        hint_color: '#da1122',
        link_color: '#22314a',
        text_color: '#31344a',
      };
      const value2 = { ...value1, secondary_bg_color: '#ffaabb' };

      expect(parseThemeParams(value1)).toStrictEqual({
        backgroundColor: '#ffaabb',
        buttonColor: '#233312',
        buttonTextColor: '#ddaa21',
        hintColor: '#da1122',
        linkColor: '#22314a',
        textColor: '#31344a',
      });
      expect(parseThemeParams(value2)).toStrictEqual({
        backgroundColor: '#ffaabb',
        buttonColor: '#233312',
        buttonTextColor: '#ddaa21',
        hintColor: '#da1122',
        linkColor: '#22314a',
        textColor: '#31344a',
        secondaryBackgroundColor: '#ffaabb',
      });
    });

   test('should throw an error in case, passed value does not satisfy schema', () => {
      expect(() => parseThemeParams({
        bg_color: 'I am wrong!',
        button_color: '#233312',
        button_text_color: '#ddaa21',
        hint_color: '#da1122',
        link_color: '#22314a',
        text_color: '#31344a',
      })).toThrow();
    });
  });
});

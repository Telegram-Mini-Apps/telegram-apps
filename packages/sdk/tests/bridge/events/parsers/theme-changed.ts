import { expect, it } from 'vitest';

import { themeChanged } from '~/bridge/events/index.js';

it('should return parsed value in case, passed value satisfies schema', () => {
  const values = [
    {
      theme_params: {
        accent_text_color: '#aaccbb',
        bg_color: '#ffaabb',
        button_color: '#faaafa',
        button_text_color: '#666271',
        destructive_text_color: '#111332',
        header_bg_color: '#aab133',
        hint_color: '#113322',
        link_color: '#882133',
        secondary_bg_color: '#2231aa',
        section_bg_color: '#111332',
        section_header_text_color: '#111332',
        subtitle_text_color: '#111332',
        text_color: '#bbaadd',
      },
    },
    {
      theme_params: {},
    },
  ];

  values.forEach((value) => {
    expect(themeChanged().parse(value)).toStrictEqual(value);
    expect(themeChanged().parse(JSON.stringify(value))).toStrictEqual(value);
  });
});

it('should throw an error in case, passed value does not satisfy schema', () => {
  expect(() => themeChanged().parse({})).toThrow();
  expect(() => themeChanged().parse({
    theme_params: {
      bg_color: 'Hello there!',
    },
  })).toThrow();
});

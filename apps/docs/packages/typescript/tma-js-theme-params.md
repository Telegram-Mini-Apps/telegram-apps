# @tma.js/theme-params

[npm-link]: https://npmjs.com/package/@tma.js/theme-params

[npm-shield]: https://img.shields.io/npm/v/@tma.js/theme-params?logo=npm

![[npm-link]][npm-shield]

Provides utilities to work with Telegram Mini Apps [theme](../../functionality/theming.md).

## Installation

::: code-group

```bash [pnpm]
pnpm i @tma.js/theme-params
```

```bash [npm]
npm i @tma.js/theme-params
```

```bash [yarn]
yarn add @tma.js/theme-params
```

:::

## Parsing

To parse value as theme parameters, package provides method `parse` and parser `themeParams`
which is being utilized by `parse`.

Method and parser accept JSON object as a string or a JavaScript object, returning the
`ThemeParams` interface. It throws an error if the passed data is invalid.

::: code-group

```typescript [Usage example]
import { parse, themeParams } from '@tma.js/theme-params';

const json = {
  accent_text_color: "#6ab2f2",
  bg_color: "#17212b",
  button_color: "#5288c1",
  button_text_color: "#ffffff",
  destructive_text_color: "#ec3942",
  header_bg_color: "#17212b",
  hint_color: "#708499",
  link_color: "#6ab3f3",
  secondary_bg_color: "#232e3c",
  section_bg_color: "#17212b",
  section_header_text_color: "#6ab3f3",
  subtitle_text_color: "#708499",
  text_color: "#f5f5f5"
};

const tp = parse(json);
// or
const tp = themeParams().parse(json);
```

```typescript [Expected result]
const result = {
  accentTextColor: "#6ab2f2",
  backgroundColor: "#17212b",
  buttonColor: "#5288c1",
  buttonTextColor: "#ffffff",
  destructiveTextColor: "#ec3942",
  headerBackgroundColor: "#17212b",
  hintColor: "#708499",
  linkColor: "#6ab3f3",
  secondaryBackgroundColor: "#232e3c",
  sectionBackgroundColor: "#17212b",
  sectionHeaderTextColor: "#6ab3f3",
  subtitleTextColor: "#708499",
  textColor: "#f5f5f5"
};
```

:::

Assuming each property is written using snake case, the parsing function replaces the word 'bg'
with 'background' and converts the resulting key to camel case.

## Serializing

To convert the theme parameters object representation to a string, developers should use
the `serialize` function:

```typescript
import { serialize } from '@tma.js/theme-params';

serialize({
  accentTextColor: "#6ab2f2",
  backgroundColor: "#17212b",
  buttonColor: "#5288c1",
  buttonTextColor: "#ffffff",
  destructiveTextColor: "#ec3942",
  headerBackgroundColor: "#17212b",
  hintColor: "#708499",
  linkColor: "#6ab3f3",
  secondaryBackgroundColor: "#232e3c",
  sectionBackgroundColor: "#17212b",
  sectionHeaderTextColor: "#6ab3f3",
  subtitleTextColor: "#708499",
  textColor: "#f5f5f5"
});

// Result:
// '{"accent_text_color":"#6ab2f2","bg_color":"#17212b","button_color":"#5288c1","button_text_color":"#ffffff","destructive_text_color":"#ec3942","header_bg_color":"#17212b","hint_color":"#708499","link_color":"#6ab3f3","secondary_bg_color":"#232e3c","section_bg_color":"#17212b","section_header_text_color":"#6ab3f3","subtitle_text_color":"#708499","text_color":"#f5f5f5"}'
```

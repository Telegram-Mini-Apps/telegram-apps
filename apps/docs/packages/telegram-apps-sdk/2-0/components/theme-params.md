# Theme Params

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [theme parameters](../../../../platform/theming.md).

## Mounting

Before using this component, it must be mounted to ensure properties are properly configured. To do
so, use the `mount` method, which updates the `isMounted` signal property.

::: code-group

```ts [Variable]
import { themeParams } from '@telegram-apps/sdk';

themeParams.mount(); 
themeParams.isMounted(); // true
```

```ts [Functions]
import {
  mountThemeParams,
  isThemeParamsMounted,
} from '@telegram-apps/sdk';

mountThemeParams(); 
isThemeParamsMounted(); // true
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
themeParams.unmount(); 
themeParams.isMounted(); // false
```

```ts [Functions]
import {
  unmountThemeParams,
  isThemeParamsMounted,
} from '@telegram-apps/sdk';

unmountThemeParams();
isThemeParamsMounted(); // false
```

:::

## Binding CSS Variables

This scope allows its properties to be exposed via CSS variables.

To create new CSS variables, use the `bindCssVars` method. When called, it updates
the `isCssVarsBound` signal property.

This method optionally accepts a function that receives a theme palette key in camel case format and
returns a CSS variable name. By default, the method transforms the palette key using these rules:

- Converts the value to kebab case.
- Prepends the `--tg-theme-` prefix.

::: code-group

```ts [Variable]
themeParams.bindCssVars();
// Creates CSS variables like:
// --tg-theme-button-color: #aabbcc
// --tg-theme-accent-text-color: #aabbcc
// --tg-theme-bg-color: #aabbcc
// ...

themeParams.bindCssVars(key => `--my-prefix-${key}`);
// Creates CSS variables like:
// --my-prefix-buttonColor: #aabbcc
// --my-prefix-accentTextColor: #aabbcc
// --my-prefix-bgColor: #aabbcc
// ...

// themeParams.isCssVarsBound() -> true
```

```ts [Functions]
import {
  bindThemeParamsCssVars,
  isThemeParamsCssVarsBound,
} from '@telegram-apps/sdk';

bindThemeParamsCssVars();
// Creates CSS variables like:
// --tg-theme-button-color: #aabbcc
// --tg-theme-accent-text-color: #aabbcc
// --tg-theme-bg-color: #aabbcc
// ...

bindThemeParamsCssVars(key => `--my-prefix-${key}`);
// Creates CSS variables like:
// --my-prefix-buttonColor: #aabbcc
// --my-prefix-accentTextColor: #aabbcc
// --my-prefix-bgColor: #aabbcc
// ...

// isThemeParamsCssVarsBound() -> true
```

:::

## Properties

::: code-group

```ts [Variable]
themeParams.accentTextColor(); // RGB | undefined
themeParams.backgroundColor(); // RGB | undefined
themeParams.buttonTextColor(); // RGB | undefined
themeParams.buttonColor(); // RGB | undefined
themeParams.destructiveTextColor(); // RGB | undefined
themeParams.headerBackgroundColor(); // RGB | undefined
themeParams.hintColor(); // RGB | undefined
themeParams.linkColor(); // RGB | undefined
themeParams.subtitleTextColor(); // RGB | undefined
themeParams.sectionBackgroundColor(); // RGB | undefined
themeParams.secondaryBackgroundColor(); // RGB | undefined
themeParams.sectionSeparatorColor(); // RGB | undefined
themeParams.sectionHeaderTextColor(); // RGB | undefined
themeParams.textColor(); // RGB | undefined

themeParams.state(); // Record<string, RGB>;
```

```ts [Functions]
import {
  themeParamsAccentTextColor,
  themeParamsBackgroundColor,
  themeParamsButtonTextColor,
  themeParamsButtonColor,
  themeParamsDestructiveTextColor,
  themeParamsHeaderBackgroundColor,
  themeParamsHintColor,
  themeParamsLinkColor,
  themeParamsSubtitleTextColor,
  themeParamsSectionBackgroundColor,
  themeParamsSecondaryBackgroundColor,
  themeParamsSectionSeparatorColor,
  themeParamsSectionHeaderTextColor,
  themeParamsTextColor,
  themeParamsState,
} from '@telegram-apps/sdk';

themeParamsAccentTextColor(); // RGB | undefined
themeParamsBackgroundColor(); // RGB | undefined
themeParamsButtonTextColor(); // RGB | undefined
themeParamsButtonColor(); // RGB | undefined
themeParamsDestructiveTextColor(); // RGB | undefined
themeParamsHeaderBackgroundColor(); // RGB | undefined
themeParamsHintColor(); // RGB | undefined
themeParamsLinkColor(); // RGB | undefined
themeParamsSubtitleTextColor(); // RGB | undefined
themeParamsSectionBackgroundColor(); // RGB | undefined
themeParamsSecondaryBackgroundColor(); // RGB | undefined
themeParamsSectionSeparatorColor(); // RGB | undefined
themeParamsSectionHeaderTextColor(); // RGB | undefined
themeParamsTextColor(); // RGB | undefined

themeParamsState(); // Record<string, RGB>;
```

:::
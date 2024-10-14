# 主题参数

💠[组件]（.../scopes.md）负责 Telegram Mini
Apps [主题参数]（.../../.../.../platform/theming.md）。

## 安装

在使用该组件之前，必须对其进行安装，以确保属性配置正确。
，使用 `mount` 方法更新 `isMounted` 信号属性。

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

要卸载，请使用 `unmount` 方法：

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

## 绑定 CSS 变量

该作用域允许通过 CSS 变量公开其属性。

要创建新的 CSS 变量，请使用 `bindCssVars` 方法。 调用时，它会更新
`isCssVarsBound` 信号属性。

该方法可选择接受一个函数，该函数接收驼峰格式的主题调色板键，
返回 CSS 变量名。 默认情况下，该方法使用这些规则转换调色板键：

- 将数值转换为 kebab 大小写。
- 预置 `--tg-theme-` 前缀。

::: code-group

```ts [Variable]
themeParams.bindCssVars();
// 创建 CSS 变量，如
// --tg-theme-button-color：#aabbcc
// --tg-theme-accent-text-color：#aabbcc
// --tg-theme-bg-color：#aabbcc
// ...

themeParams.bindCssVars(key => `--my-prefix-${key}`);
// 创建 CSS 变量：
// --my-prefix-buttonColor：#aabbcc
// --my-prefix-accentTextColor：#aabbcc
// --my-prefix-bgColor：#aabbcc
// ...

// themeParams.isCssVarsBound() -> true
```

```ts [Functions]
import {
  bindThemeParamsCssVars,
  isThemeParamsCssVarsBound,
} from '@telegram-apps/sdk';

bindThemeParamsCssVars();
// Creates CSS variables like：
// --tg-theme-button-color：#aabbcc
// --tg-theme-accent-text-color：#aabbcc
// --tg-theme-bg-color：#aabbcc
// ...

bindThemeParamsCssVars(key => `--my-prefix-${key}`);
// 创建 CSS 变量：
// --my-prefix-buttonColor：#aabbcc
// --my-prefix-accentTextColor：#aabbcc
// --my-prefix-bgColor：#aabbcc
// ...

// isThemeParamsCssVarsBound() -> true
```

:::

## 属性

::: code-group

```ts [Variable]
themeParams.accentTextColor(); // RGB | undefined
themeParams.backgroundColor(); // RGB | undefined
themeParams.buttonTextColor(); // RGB | undefined
themeParams.buttonColor(); // RGB | undefined themeParams.destructiveTextColor(); // RGB | undefined buttonColor(); // RGB | undefined
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

themeParams.state(); // Record<string, RGB> ；
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
  themeParamsLinkColor、
  themeParamsSubtitleTextColor,
  themeParamsSectionBackgroundColor,
  themeParamsSecondaryBackgroundColor,
  themeParamsSectionSeparatorColor,
  themeParamsSectionHeaderTextColor,
  themeParamsTextColor,
  themeParamsState,
} from '@telegram-apps/sdk'；

themeParamsAccentTextColor(); // RGB | undefined
themeParamsBackgroundColor(); // RGB | undefined
themeParamsButtonTextColor()；// RGB | undefined
themeParamsButtonColor(); // RGB | undefined
themeParamsDestructiveTextColor(); // RGB | undefined
themeParamsHeaderBackgroundColor(); // RGB | undefined
themeParamsHintColor(); // RGB | undefined
themeParamsLinkColor(); // RGB | undefined
themeParamsSubtitleTextColor()；// RGB | undefined
themeParamsSectionBackgroundColor(); // RGB | undefined
themeParamsSecondaryBackgroundColor(); // RGB | undefined
themeParamsSectionSeparatorColor()；// RGB | undefined
themeParamsSectionHeaderTextColor(); // RGB | undefined
themeParamsTextColor(); // RGB | undefined

themeParamsState(); // Record<string, RGB> ；
```

:::

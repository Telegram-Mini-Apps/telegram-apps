# 视口

负责 Telegram Mini
Apps [viewport](../../../../.platform/viewport.md) 的💠[组件](../scopes.md)。

## 安装

在使用该组件之前，有必要将其安装到正确配置的属性中。
为此，请使用 `mount` 方法。 它将更新 `isMounted` 信号属性。

::: code-group

```ts [Variable]
import { viewport } from '@telegram-apps/sdk';

viewport.mount();
viewport.isMounted(); // true
```

```ts [Functions]
import {
  mountViewport,
  isViewportMounted,
} from '@telegram-apps/sdk';

mountViewport();
isViewportMounted(); // true
```

:::

要卸载，请使用 `unmount` 方法：

::: code-group

```ts [Variable]
viewport.unmount();
viewport.isMounted(); // false
```

```ts [Functions]
import {
  unmountViewport,
  isViewportMounted,
} from '@telegram-apps/sdk';

unmountViewport();
isViewportMounted(); // false
```

:::

## 绑定 CSS 变量

要通过 CSS 变量公开 `viewport` 属性，请使用 `bindCssVars` 方法。
调用该方法后，"isCssVarsBound "信号属性会被更新。

此方法可选择接受一个函数，该函数可将 `width`、`height`
和 `stableHeight` 的值转换为 CSS 变量名。 默认情况下，数值会通过
前缀 `--tg-viewport-` 转换为 kebab 大小写。

::: code-group

```ts [Variable]
viewport.bindCssVars();
// 创建 CSS 变量，如
// --tg-viewport-height: 675px
// --tg-viewport-width: 320px
// --tg-viewport-stable-height: 675px

viewport.bindCssVars(key => `--my-prefix-${key}`);
// 创建类似的 CSS 变量：
// --my-prefix-height: 675px
// --my-prefix-width: 320px
// --my-prefix-stableHeight: 675px

viewport.isCssVarsBound(); // true
```

```ts [Functions]
import {
  bindViewportCssVars,
  isViewportCssVarsBound,
} from '@telegram-apps/sdk';

bindViewportCssVars();
// Creates CSS variables like：
// --tg-viewport-height: 675px
// --tg-viewport-width: 320px
// --tg-viewport-stable-height: 675px

bindViewportCssVars(key => `--my-prefix-${key}`);
// 创建 CSS 变量：
// --my-prefix-height: 675px
// --my-prefix-width: 320px
// --my-prefix-stableHeight: 675px

isViewportCssVarsBound(); // true
```

:::

## 扩展

要扩展视口，请使用 `expand` 方法。

::: code-group

```ts [Variable]
viewport.expand()；
```

```ts [Functions]
import { expandViewport } from '@telegram-apps/sdk';

expandViewport()；
```

:::

# Mini App

The 💠[component](../scopes.md) responsible for managing functionality within Telegram Mini Apps.

## Mounting

Before using this component, it must be mounted using the `mount` method, which updates
the `isMounted` signal property.

::: code-group

```ts [Variable]
import { miniApp } from '@telegram-apps/sdk';

if (miniApp.mount.isAvailable()) {
  miniApp.mount();
  miniApp.isMounted(); // true
}
```

```ts [Functions]
import { mountMiniApp, isMiniAppMounted } from '@telegram-apps/sdk';

if (mountMiniApp.isAvailable()) {
  mountMiniApp();
  isMiniAppMounted(); // true
}
```

:::

> [!INFO]
> The `mount` method also mounts the [Theme Params](theme-params.md) scope to extract correctly
> configured values.

To unmount the component, use the `unmount` method:

::: code-group

```ts [Variable]
miniApp.unmount();
miniApp.isMounted(); // false
```

```ts [Functions]
import { unmountMiniApp, isMiniAppMounted } from '@telegram-apps/sdk';

unmountMiniApp();
isMiniAppMounted(); // false
```

:::

## Binding CSS Variables

To expose the `miniApp` properties via CSS variables, use the `bindCssVars` method.
The `isCssVarsBound` signal property is updated after the method is called.

This method optionally accepts a function that transforms the values `bgColor` and `headerColor`
into CSS variable names. By default, values are converted to kebab case with the prefix `--tg-`.

::: code-group

```ts [Variable]
if (miniApp.bindCssVars.isAvailable()) {
  miniApp.bindCssVars();
  // Creates CSS variables like:
  // --tg-bg-color: #aabbcc
  // --tg-header-color: #aabbcc

  miniApp.bindCssVars(key => `--my-prefix-${key}`);
  // Creates CSS variables like:
  // --my-prefix-bgColor: #aabbcc
  // --my-prefix-headerColor: #aabbcc

  miniApp.isCssVarsBound(); // true
}
```

```ts [Functions]
import { bindMiniAppCssVars, isMiniAppCssVarsBound } from '@telegram-apps/sdk';

if (bindMiniAppCssVars.isAvailable()) {
  bindMiniAppCssVars();
  // Creates CSS variables like:
  // --tg-bg-color: #aabbcc
  // --tg-header-color: #aabbcc

  bindMiniAppCssVars(key => `--my-prefix-${key}`);
  // Creates CSS variables like:
  // --my-prefix-bgColor: #aabbcc
  // --my-prefix-headerColor: #aabbcc

  isMiniAppCssVarsBound(); // true
}
```

:::

## Header Color

To change the mini application header color, the method `setHeaderColor` is used. In turn,
calling this method updates the `headerColor` signal property value.

The method accepts either an RGB color value or one of the following
strings: `bg_color`, `secondary_bg_color`.

::: code-group

```ts [Variable]
if (miniApp.setHeaderColor.isAvailable()) {
  miniApp.setHeaderColor('bg_color');
  miniApp.headerColor(); // 'bg_color'
}

if (
  miniApp.setHeaderColor.isAvailable()
  && miniApp.setHeaderColor.supports('rgb')
) {
  miniApp.setHeaderColor('#aabbcc');
  miniApp.headerColor(); // '#aabbcc'
}
```

```ts [Functions]
import {
  setMiniAppHeaderColor,
  miniAppHeaderColor,
} from '@telegram-apps/sdk';

if (setMiniAppHeaderColor.isAvailable()) {
  setMiniAppHeaderColor('bg_color');
  miniAppHeaderColor(); // 'bg_color'
}

if (
  setMiniAppHeaderColor.isAvailable()
  && setMiniAppHeaderColor.supports('rgb')
) {
  setMiniAppHeaderColor('#aabbcc');
  miniAppHeaderColor(); // '#aabbcc'
}
```

:::

## Background Color

To update the mini application background color, use the `setBackgroundColor` method. Calling
this method updates the `headerColor` signal property value.

::: code-group

```ts [Variable]
if (miniApp.setBackgroundColor.isAvailable()) {
  miniApp.setBackgroundColor('#ffffff');
  miniApp.backgroundColor(); // '#ffffff'
}
```

```ts [Functions]
import { 
  setMiniAppBackgroundColor,
  miniAppBackgroundColor,
} from '@telegram-apps/sdk';

if (setMiniAppBackgroundColor.isAvailable()) {
  setMiniAppBackgroundColor('#ffffff');
  miniAppBackgroundColor(); // '#ffffff'
}
```

:::

## Methods

### `close`

To close the mini application, use the `close` method.

::: code-group

```ts [Variable]
if (miniApp.close.isAvailable()) {
  miniApp.close();
}
```

```ts [Functions]
import { closeMiniApp } from '@telegram-apps/sdk';

if (miniApp.close.isAvailable()) {
  miniApp.close();
}
```

:::

### `ready`

To signal that the Mini App is ready to be displayed, use the `ready` method. Once called, the
loading placeholder is hidden, and the Mini App is shown.

::: code-group

```ts [Variable]
if (miniApp.ready.isAvailable()) {
  miniApp.ready();
}
```

```ts [Functions]
import { miniAppReady } from '@telegram-apps/sdk';

if (miniAppReady.isAvailable()) {
  miniAppReady();
}
```

:::

> [!TIP]
> Call this function as early as possible after loading essential interface elements to ensure a
> smooth user experience.
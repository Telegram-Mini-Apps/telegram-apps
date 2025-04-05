# Mini App

The 💠[component](../scopes.md) responsible for managing functionality within Telegram Mini Apps.

## Mounting

Before using the component, it must be mounted.

> [!TIP] Actual sync mount
> To mount the component, use the `mountSync` method. It will update the `isMounted` signal property.
> 
> ::: code-group
> 
> ```ts [Variable]
> import { miniApp } from '@telegram-apps/sdk';
> 
> if (miniApp.mountSync.isAvailable()) {
>   miniApp.mountSync();
>   miniApp.isMounted(); // true
> }
> ```
> 
> ```ts [Functions]
> import { mountMiniAppSync, isMiniAppMounted } from '@telegram-apps/sdk';
> 
> if (mountMiniAppSync.isAvailable()) {
>   mountMiniAppSync();
>   isMiniAppMounted(); // true
> }
> ```
> 
> :::

> [!WARNING] Deprecated async mount
> This process is asynchronous, as theme parameters need to be requested from the Telegram
> application. The `isMounting` signal will be set to `true` during the process and updated to `false`
> when complete.
>
> If mounting is successful, the `isMounted` signal will be set to `true`. If errors occur,
> the `mountError` signal will reflect the error.
>
> ::: code-group
> 
> ```ts [Variable]
> if (miniApp.mount.isAvailable()) {
>   try {
>     const promise = miniApp.mount();
>     miniApp.isMounting(); // true
>     await promise;
>     miniApp.isMounting(); // false
>     miniApp.isMounted(); // true
>   } catch (err) {
>     miniApp.mountError(); // equals "err"
>     miniApp.isMounting(); // false
>     miniApp.isMounted(); // false
>   }
> }
> ```
> 
> ```ts [Functions]
> import {
>   mountminiApp,
>   isMiniAppMounting,
>   isMiniAppMounted,
>   miniAppMountError,
> } from '@telegram-apps/sdk';
> 
> if (mountminiApp.isAvailable()) {
>   try {
>     const promise = mountminiApp();
>     isMiniAppMounting(); // true
>     await promise;
>     isMiniAppMounting(); // false
>     isMiniAppMounted(); // true
>   } catch (err) {
>     miniAppMountError(); // equals "err"
>     isMiniAppMounting(); // false
>     isMiniAppMounted(); // false
>   }
> }
> ```
> 
> :::
> 
> > [!INFO]
> > The `mount` method also mounts the [Theme Params](theme-params.md) scope to extract correctly
> > configured values.

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

## Active State

The mini application becomes inactive if it is wrapped into the bottom native Telegram client tray
or if the currently active tab of the mini apps browser is changed to another one.

To track if the mini application is currently active, use the `isActive` signal.

::: code-group

```ts [Variable]
miniApp.isActive();
```

```ts [Functions]
import { isMiniAppActive } from '@telegram-apps/sdk';

isMiniAppActive()
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
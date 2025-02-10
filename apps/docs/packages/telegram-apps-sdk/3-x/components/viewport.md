# Viewport

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [viewport](../../../../platform/viewport.md).

## Mounting

Before using the component, it must be mounted.

This process is asynchronous, as viewport information needs to be requested from the Telegram
application. The `isMounting` signal will be set to `true` during the process and updated to `false`
when complete.

If mounting is successful, the `isMounted` signal will be set to `true`. If errors occur,
the `mountError` signal will reflect the error.

::: code-group

```ts [Variable]
if (viewport.mount.isAvailable()) {
  try {
    const promise = viewport.mount();
    viewport.isMounting(); // true
    await promise;
    viewport.isMounting(); // false
    viewport.isMounted(); // true
  } catch (err) {
    viewport.mountError(); // equals "err"
    viewport.isMounting(); // false
    viewport.isMounted(); // false
  }
}
```

```ts [Functions]
import {
  mountViewport,
  isViewportMounting,
  isViewportMounted,
  viewportMountError,
} from '@telegram-apps/sdk';

if (mountViewport.isAvailable()) {
  try {
    const promise = mountViewport();
    isViewportMounting(); // true
    await promise;
    isViewportMounting(); // false
    isViewportMounted(); // true
  } catch (err) {
    viewportMountError(); // equals "err"
    isViewportMounting(); // false
    isViewportMounted(); // false
  }
}
```

:::

To unmount, use the `unmount` method:

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

## Binding CSS Variables

To expose the `viewport` properties via CSS variables, use the `bindCssVars` method.
The `isCssVarsBound` signal property is updated after the method is called.

This method optionally accepts a function that transforms the values `width`, `height`
and `stableHeight` into CSS variable names. By default, values are converted to kebab case with the
prefix `--tg-viewport-`.

::: code-group

```ts [Variable]
import { viewport } from '@telegram-apps/sdk';

if (viewport.bindCssVars.isAvailable()) {
  viewport.bindCssVars();
  // Creates CSS variables like:
  // --tg-viewport-height: 675px
  // --tg-viewport-width: 320px
  // --tg-viewport-stable-height: 675px

  viewport.bindCssVars(key => `--my-prefix-${key}`);
  // Creates CSS variables like:
  // --my-prefix-height: 675px
  // --my-prefix-width: 320px
  // --my-prefix-stableHeight: 675px

  viewport.isCssVarsBound(); // true
}
```

```ts [Functions]
import {
  bindViewportCssVars,
  isViewportCssVarsBound,
} from '@telegram-apps/sdk';

if (bindViewportCssVars.isAvailable()) {
  bindViewportCssVars();
  // Creates CSS variables like:
  // --tg-viewport-height: 675px
  // --tg-viewport-width: 320px
  // --tg-viewport-stable-height: 675px

  bindViewportCssVars(key => `--my-prefix-${key}`);
  // Creates CSS variables like:
  // --my-prefix-height: 675px
  // --my-prefix-width: 320px
  // --my-prefix-stableHeight: 675px

  isViewportCssVarsBound(); // true
}
```

:::

## Expanding

To expand the viewport, use the `expand` method.

::: code-group

```ts [Variable]
if (viewport.expand.isAvailable()) {
  viewport.expand();
}
```

```ts [Functions]
import { expandViewport } from '@telegram-apps/sdk';

if (expandViewport.isAvailable()) {
  expandViewport();
}
```

:::

## Fullscreen Mode

To enable the fullscreen mode, the method `requestFullscreen` is used:

::: code-group

```ts [Variable]
if (viewport.requestFullscreen.isAvailable()) {
  await viewport.requestFullscreen();
  viewport.isFullscreen(); // true
}
```

```ts [Functions]
import { requestFullscreen, isFullscreen } from '@telegram-apps/sdk';

if (requestFullscreen.isAvailable()) {
  await requestFullscreen();
  isFullscreen(); // true
}
```

:::

To exit the fullscreen mode, use the `exitFullscreen` method:

::: code-group

```ts [Variable]
if (viewport.exitFullscreen.isAvailable()) {
  await viewport.exitFullscreen();
  viewport.isFullscreen(); // false
}
```

```ts [Functions]
import { exitFullscreen, isFullscreen } from '@telegram-apps/sdk';

if (exitFullscreen.isAvailable()) {
  await exitFullscreen();
  isFullscreen(); // false
}
```

:::

## Safe Area Insets

The viewport component offers access to two types of insets:

- **Safe area insets**
- **Content safe area insets**

For more details on the differences between these inset types, visit the
[**Viewport**](../../../../platform/viewport.md) page.

The component provides access to these insets through the following signals:

::: code-group

```ts [Variable]
// Objects with numeric properties "top", "bottom", "left" and "right".
viewport.safeAreaInsets();
viewport.contentSafeAreaInsets();

// Numeric values.
viewport.safeAreaInsetTop();
viewport.safeAreaInsetBottom();
viewport.safeAreaInsetLeft();
viewport.safeAreaInsetRight();
viewport.contentSafeAreaInsetTop();
viewport.contentSafeAreaInsetBottom();
viewport.contentSafeAreaInsetLeft();
viewport.contentSafeAreaInsetRight();
```

```ts [Functions]
import {
  viewportSafeAreaInsets,
  viewportSafeAreaInsetTop,
  viewportSafeAreaInsetBottom,
  viewportSafeAreaInsetLeft,
  viewportSafeAreaInsetRight,
  viewportContentSafeAreaInsets,
  viewportContentSafeAreaInsetTop,
  viewportContentSafeAreaInsetBottom,
  viewportContentSafeAreaInsetLeft,
  viewportContentSafeAreaInsetRight,
} from '@telegram-apps/sdk';

// Objects with numeric properties "top", "bottom", "left" and "right".
viewportSafeAreaInsets();
viewportContentSafeAreaInsets();

// Numeric values.
viewportSafeAreaInsetTop();
viewportSafeAreaInsetBottom();
viewportSafeAreaInsetLeft();
viewportSafeAreaInsetRight();
viewportContentSafeAreaInsetTop();
viewportContentSafeAreaInsetBottom();
viewportContentSafeAreaInsetLeft();
viewportContentSafeAreaInsetRight();
```

:::
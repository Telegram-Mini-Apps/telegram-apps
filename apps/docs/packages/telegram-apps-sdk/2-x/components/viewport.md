# Viewport

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [viewport](../../../../platform/viewport.md).

## Mounting

Before using the component, it is necessary to mount it to work with properly configured properties.
To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { viewport } from '@telegram-apps/sdk';

if (viewport.mount.isAvailable()) {
  viewport.mount();
  viewport.isMounted(); // true
}
```

```ts [Functions]
import {
  mountViewport,
  isViewportMounted,
} from '@telegram-apps/sdk';

if (mountViewport.isAvailable()) {
  mountViewport();
  isViewportMounted(); // true
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
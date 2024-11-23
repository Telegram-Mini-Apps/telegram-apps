# Safe Area

The 💠[component](../scopes.md) responsible for the Telegram Mini
Apps [safe area](../../../../platform/safe-area.md).

## Mounting

Before using the component, it is necessary to mount it to work with properly configured properties.
To do so, use the `mount` method. It will update the `isMounted` signal property.

::: code-group

```ts [Variable]
import { safeArea } from '@telegram-apps/sdk';

if (safeArea.mount.isAvailable()) {
  safeArea.mount();
  safeArea.isMounted(); // true
}
```

```ts [Functions]
import {
  mountSafeArea,
  isSafeAreaMounted,
} from '@telegram-apps/sdk';

if (mountSafeArea.isAvailable()) {
  mountSafeArea();
  isSafeAreaMounted(); // true
}
```

:::

To unmount, use the `unmount` method:

::: code-group

```ts [Variable]
safeArea.unmount();
safeArea.isMounted(); // false
```

```ts [Functions]
import {
  unmountSafeArea,
  isSafeAreaMounted,
} from '@telegram-apps/sdk';

unmountSafeArea();
isSafeAreaMounted(); // false
```

:::

## Binding CSS Variables

To expose the `safeArea` properties via CSS variables, use the `bindCssVars` method.
The `isCssVarsBound` signal property is updated after the method is called.

This method optionally accepts a function that transforms the values `top`, `bottom`, `left`
and `right` into CSS variable names. By default, values are converted to kebab case with the
prefix `--tg-safe-area-` and `--tg-content-safe-area`.

::: code-group

```ts [Variable]
import { safeArea } from '@telegram-apps/sdk';

if (safeArea.bindCssVars.isAvailable()) {
  safeArea.bindCssVars();
  // Creates CSS variables like:
  // --tg-safe-area-inset-top: 0px;
  // --tg-safe-area-inset-bottom: 30px;
  // --tg-safe-area-inset-left: 40px;
  // --tg-safe-area-inset-right: 40px;

  // --tg-content-safe-area-inset-top: 40px;
  // --tg-content-safe-area-inset-bottom: 0px;
  // --tg-content-safe-area-inset-left: 0px;
  // --tg-content-safe-area-inset-right: 0px;

  safeArea.bindCssVars((component, property) => `--my-prefix-${component}-${property}`);
  // Creates CSS variables like:
  // --my-prefix-safeArea-top: 0px;
  // --my-prefix-safeArea-bottom: 30px;
  // --my-prefix-safeArea-bottom: 40px;
  // --my-prefix-safeArea-right: 40px;
  
  // --my-prefix-contentSafeArea-top: 40px;
  // --my-prefix-contentSafeArea-bottom: 0px;
  // --my-prefix-contentSafeArea-left: 0px;
  // --my-prefix-contentSafeArea-right: 0px;

  safeArea.isCssVarsBound(); // true
}
```

```ts [Functions]
import {
  bindSafeAreaCssVars,
  isSafeAreaCssVarsBound,
} from '@telegram-apps/sdk';

if (bindSafeAreaCssVars.isAvailable()) {
  bindSafeAreaCssVars();
  // Creates CSS variables like:
  // --tg-safe-area-inset-top: 0px;
  // --tg-safe-area-inset-bottom: 30px;
  // --tg-safe-area-inset-left: 40px;
  // --tg-safe-area-inset-right: 40px;

  // --tg-content-safe-area-inset-top: 40px;
  // --tg-content-safe-area-inset-bottom: 0px;
  // --tg-content-safe-area-inset-left: 0px;
  // --tg-content-safe-area-inset-right: 0px;

  bindSafeAreaCssVars((component, property) => `--my-prefix-${component}-${property}`);
  // Creates CSS variables like:
  // --my-prefix-safeArea-top: 0px;
  // --my-prefix-safeArea-bottom: 30px;
  // --my-prefix-safeArea-bottom: 40px;
  // --my-prefix-safeArea-right: 40px;

  // --my-prefix-contentSafeArea-top: 40px;
  // --my-prefix-contentSafeArea-bottom: 0px;
  // --my-prefix-contentSafeArea-left: 0px;
  // --my-prefix-contentSafeArea-right: 0px;

  isSafeAreaCssVarsBound(); // true
}
```

:::

## Types

### SafeAreaInset

Type representing `safe area` and `content safe area` paddings:

```ts [Variable]
type SafeAreaInset = {
  top: number,
  bottom: number,
  left: number,
  right: number
};
```

### State

Type representing `full state` of `safe area`:

```ts [Variable]
type State = {
  inset: SafeAreaInset,
  contentSafeArea: SafeAreaInset
};
```

## Signals

This section provides a complete list of signals related to the init data.

## `inset`

Return type: `SafeAreaInset`

To get safeArea state, use the `inset` method.

::: code-group

```ts [Variable]
safeArea.inset(); // { top: 0, bottom: 30, left: 40, right: 40 }
```

```ts [Functions]
import { safeAreaInset } from '@telegram-apps/sdk';

safeAreaInset(); // { top: 0, bottom: 30, left: 40, right: 40 }
```

:::

## `contentInset`

To get contentSafeArea state, use the `contentInset` method.

::: code-group

```ts [Variable]
safeArea.contentInset(); // { top: 40, bottom: 0, left: 0, right: 0 }
```

```ts [Functions]
import { contentSafeAreaInset } from '@telegram-apps/sdk';

contentSafeAreaInset(); // { top: 40, bottom: 0, left: 0, right: 0 }
```

:::

## `state`

To get full safe area state, use the `state` method.

::: code-group

```ts [Variable]
safeArea.state(); 
// { 
//   inset: { top: 0, bottom: 30, left: 40, right: 40 }
//   contentInset: { top: 40, bottom: 0, left: 0, right: 0 }
// }
```

```ts [Functions]
import { safeAreaState } from '@telegram-apps/sdk';

safeAreaState();
// { 
//   inset: { top: 0, bottom: 30, left: 40, right: 40 }
//   contentInset: { top: 40, bottom: 0, left: 0, right: 0 }
// }
```

:::
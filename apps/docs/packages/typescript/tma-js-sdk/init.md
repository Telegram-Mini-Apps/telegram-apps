---
outline: [2, 3]
---

# Initialization

According to the design of this package, the developer has complete control over its lifecycle,
including the initialization process. This means that there are no pre-initialized global components
available for use by the developer. They must create the components themselves.

To simplify the developer's workflow, the package includes a special function called `init`. This
function returns instances of the initialized components, making it easier for developers to work
with the package.

Here is some init example:

```typescript
import { init } from '@tma.js/sdk';

const { mainButton, viewport } = init();

mainButton.on('click', () => viewport.expand());

mainButton
  .setBackgroundColor('#ff0000')
  .setTextColor('#ffffff')
  .setText('Expand')
  .enable()
  .show();
```

## Options

The `init` function has the ability to accept options, which are specified as an object in the first
argument of the function. Each option and the options object itself are optional.

```typescript
import { init } from '@tma.js/sdk';

init(options);
```

### `async`

Type: `boolean`, default: `false`

The SDK initialization process supports two modes: synchronous and asynchronous.

Asynchronous initialization differs from the synchronous way in only one aspect: it performs all
asynchronous operations and waits for their completion. For example, the init function retrieves
actual viewport information, and async initialization will return actual viewport data. The
synchronous way would return the viewport with default values.

::: code-group

```typescript [Synchronous]
import { init } from '@tma.js/sdk';

const result = init();
console.log(result.viewport);
// Output:
// Viewport {
//   height: 0,
//   width: 0,
//   isExpanded: false,
//   stableHeight: 0,
// };
```

```typescript [Asynchronous]
import { init } from '@tma.js/sdk';

init({ async: true }).then((result) => {
  console.log(result.viewport);
  // Output:
  // Viewport {
  //   height: 390,
  //   width: 365,
  //   isExpanded: true,
  //   stableHeight: 390,
  // };
});
```

:::

::: info

Currently, there is only one asynchronous operation performed in the `init` function - retrieval of
the current viewport state. In case you don't need that data, you can choose synchronous
initialization.

Nevertheless, it is recommended to follow the asynchronous way to prepare the code for new possible
future asynchronous operations.

:::

### `acceptCustomStyles`

Type: `boolean`, default: `false`

True if SDK should accept styles sent from the Telegram application. This option is only used in
web versions of Telegram.

### `cssVars`

Type: `boolean | { themeParams?: boolean, viewport?: boolean, miniApp?: boolean }`, default: `false`

Creates global CSS variables connected to the current SDK components. The created variables are
automatically updated when connected components change their state.

The developer is also allowed to pass an object with optional fields `themeParams`, `viewport`,
and `miniApp`. The `init` function will create CSS variables for components that have a value
of `true` in this object.

Mini App variables:

- `--tg-background-color`
- `--tg-header-color`

Viewport variables:

- `--tg-viewport-height`
- `--tg-viewport-width`
- `--tg-viewport-stable-height`

Theme parameters variables depend on the data returned from the Telegram application. The `init`
function modifies palette keys following these rules:

1. Replace snake case names with kebab case:
   ```typescript
   backgroundColor -> background-color
   ```
2. Prepend the `--tg-theme-` prefix:
   ```typescript
   background-color -> --tg-theme-background-color
   ```

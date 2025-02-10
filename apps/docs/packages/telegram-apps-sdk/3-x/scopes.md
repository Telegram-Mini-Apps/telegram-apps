---
outline: [ 2, 3 ]
---

# Scopes

This package is designed to give developers full control over its lifecycle, including the
initialization process. Therefore, there are no pre-initialized global scopes available for use;
developers must configure the scopes themselves.

By *scope*, we refer to a collection of related functionality grouped into a single entity. Examples
of scopes include `backButton` and `mainButton`. This design makes the SDK more intuitive and
efficient to use.

It's important to note that scopes are provided in the following forms:

💠**Components**. They are exported as both a variable and a set of functions simultaneously.
For instance, developers can work with the exported `backButton` variable or
its alternative function set: `showBackButton`, `mountBackButton`, etc.

⚙️**Utilities**. They are exported as a set of functions. These scopes are abstract and not grouped
into a single variable. Examples include `openLink`, `shareURL`, etc.

Effectively, exported variables are simply compositions of the same exported functions.
So, `backButton.isMounted` and `isBackButtonMounted` are essentially the same entity.

Here's an example:

```ts
import {
  backButton,
  hideBackButton,
  isBackButtonVisible,
} from '@telegram-apps/sdk';

isBackButtonVisible(); // false

backButton.show();
// backButton.isVisible and isBackButtonVisible are the same 
// entity (signal). We can say the same about backButton.show 
// and showBackButton.
//
// backButton.isVisible() -> true
// isBackButtonVisible() -> true

hideBackButton();
// backButton.isVisible() -> false
// isBackButtonVisible() -> false
```

The key difference here lies in the final bundle size. Internally, the `backButton` export is
handled through the following code:

```ts
export * as backButton from 'somewhere';
```

When not using the package source code while building the application, the bundler is more likely to
make `backButton` a non-treeshakeable object. As a result, all dependencies from `somewhere` will be
bundled, slightly increasing the final bundle size (though not by much).

## Usage Prerequisites

Each SDK method related to 💠components or ⚙️utilities has at least two requirements:

1. **The SDK must be [initialized](./initializing.md)**. This ensures that you are using valid
   global dependencies (such as `postEvent`).

```ts
import { init } from '@telegram-apps/sdk';

init();
```

2. **The method must be run inside Telegram Mini Apps**. Calling the method outside Telegram Mini
   Apps will not produce the expected behavior.

For component-related methods, there is an additional requirement:

3. **The parent component must be mounted**. This ensures that you are using a properly configured
   component.

```ts
import { init, backButton } from '@telegram-apps/sdk';

// Initialize the SDK.
init();

// Mount the Back Button component.
backButton.mount();
```

When all requirements are met, the method call becomes safe.

### Methods Availability

To check if a method is safe to call (available), use the `isAvailable()` signal:

```ts
import { backButton } from '@telegram-apps/sdk';

if (backButton.show.isAvailable()) {
  backButton.show();
}
```

This signal performs all checks described in the [Usage Prerequisites](#usage-prerequisites) section
and returns `true` if the current state satisfies them.

As an alternative, you may find the `ifAvailable(...args)` method useful. It calls the original
function with the provided arguments only if it is available (`isAvailable()` returns `true`):

```ts
import { backButton } from '@telegram-apps/sdk';

backButton.show.ifAvailable();
```

In case the original method (`backButton.show` in this case) is unavailable, the `ifAvailable`
method call will return a tuple with `false` value. Otherwise `[true, *result*]` will be received.

## Optimizing Bundle

> [!TIP]
> The SDK works efficiently out of the box, so there is generally no need to follow the
> optimizations described in this section. However, these guidelines can be helpful if you want to
> maximize the package's efficiency in specific scenarios.

Let’s look at how we can use the package more efficiently:

- Using functions exclusively allows the bundler to tree-shake unused scope code.

```ts
import { showBackButton, backButton } from '@telegram-apps/sdk';

showBackButton();
// Only showBackButton's source code will be bundled.

backButton.show();
// All backButton dependencies will be bundled, even 
// if not used in the code: backButton.show(), 
// backButton.hide(), backButton.isVisible(), etc.
```

- Configure the bundler to use the source code instead of the built version.

```ts
import { backButton } from '@telegram-apps/sdk';

backButton.show();
// Only backButton.show's source code will be bundled 
// because the bundler is smart enough to understand 
// that backButton.show is just the showBackButton 
// function, so only its source code is bundled.
```

Here's an example of a Vite config using the `resolve` option:

```ts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@telegram-apps/sdk': resolve('node_modules/@telegram-apps/sdk/src'),
    },
  },
});
```

# Migrating from v2 to v3

Since the package mostly re-exports from [@telegram-apps/bridge](../../telegram-apps-bridge/2-x.md), we recommend
reviewing its own [migration guide](../../telegram-apps-bridge/2-x/migrate-v1-v2.md) first.

This document outlines the migration steps from version 2 to version 3 of the `@telegram-apps/sdk` package.

## Changes to `ThemeParams` and `MiniApp` Mounting

In v3, the mounting process for both `ThemeParams` and `MiniApp` was unintentionally made asynchronous. This means
calling their `mount` methods now returns a promise. Since `MiniApp` mounts `ThemeParams` internally, you should **not
mount both simultaneously**.

To avoid potential issues, you can use the synchronous alternative `mountSync`, which safely mounts both components in
any order.

:::code-group

```ts [v2]
import { themeParams, miniApp } from '@telegram-apps/bridge';

themeParams.mount();
miniApp.mount();
```

```ts [v3]
import { themeParams, miniApp } from '@telegram-apps/bridge';

// If ThemeParams is required.
await themeParams.mount();

// Or if MiniApp is required.
await miniApp.mount();

// Avoid this — it may cause issues.
await Promise.all([themeParams.mount(), miniApp.mount()]);
```

```ts [v3 sync]
import { themeParams, miniApp } from '@telegram-apps/bridge';

// Safe to call in any order.
themeParams.mountSync();
miniApp.mountSync();
```

:::
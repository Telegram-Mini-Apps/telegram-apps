# Globals

By globals, we mean global values used across methods in the package.

## `$debug`

The `$debug` signal is responsible for enabling or disabling additional debug logs.

```typescript
import { $debug } from '@telegram-apps/bridge';

$debug.set(true);
```

After setting it to `true`, you will see logs when calling the postEvent function or receiving Mini
Apps events.

## `$targetOrigin`

If the package is used in a browser environment (iframe), it employs the `window.parent.postMessage`
function. This function requires specifying the target origin to ensure events are only sent to
trusted parent iframes. By default, the package uses `https://web.telegram.org` as the origin.

```typescript
import { $targetOrigin } from '@telegram-apps/bridge';

$targetOrigin.set('https://i-know-what-i-am.doing');
```

::: warning
It is strongly recommended not to override this value, as it could lead to security issues. Specify
this value only when you are certain of its impact.
:::

[//]: # (## `$version`)

[//]: # ()

[//]: # (This signal is responsible for providing the information on which Telegram Mini Apps version)

[//]: # (is currently supported by the application.)

[//]: # ()

[//]: # (## Configuring)

[//]: # ()

[//]: # (As long as the package has no side effects &#40;it doesn't perform any operations on import&#41;, you)

[//]: # (should configure the global values by yourself. To do so, you should use the `configure` method:)

[//]: # ()

[//]: # (```ts)

[//]: # (import { configure, $version } from '@telegram-apps/bridge';)

[//]: # ()

[//]: # (console.log&#40;$version&#40;&#41;&#41;; // )

[//]: # (configure&#40;&#41;)

[//]: # (```)
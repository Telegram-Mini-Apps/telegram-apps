# Globals

By globals, we mean global values used across methods in the package.

## Enabling Debug Mode

Enabling debug mode will lead to showing additional useful logs. To enable or disable it,
use the `setDebug` function:

```typescript
import { setDebug } from '@telegram-apps/bridge';

setDebug(true);
```

After setting it to `true`, you will see logs when calling the `postEvent` function or receiving
Mini Apps events.

## `targetOrigin`

If the package is used in a browser environment (iframe), it employs the `window.parent.postMessage`
function. This function requires specifying the target origin to ensure events are only sent to
trusted parent iframes. By default, the package uses `https://web.telegram.org` as the origin.

```typescript
import { targetOrigin } from '@telegram-apps/bridge';

targetOrigin.set('https://i-know-what-i-am.doing');
```

> [!WARNING]
> It is strongly recommended not to override this value, as it could lead to security issues.
> Specify this value only when you are certain of its impact.

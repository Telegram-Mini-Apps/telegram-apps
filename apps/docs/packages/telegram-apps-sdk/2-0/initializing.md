# Initializing

As mentioned in
the `@telegram-apps/bridge` [documentation](../../telegram-apps-bridge/events.md#define-event-handlers),
to start listening to Telegram Mini Apps events, event handlers must be defined manually.

However, to ensure that some Telegram web version-specific events are received and make the
application work properly, we should use the `init` function. This function accepts an optional
boolean argument (default is `true`) that controls whether to receive custom styles from the
Telegram application, including configuring the visual representation of the scrollbar.

Also, remember to configure [globals](globals.md) (call the `configure` function).

```ts
import { init, configure } from '@telegram-apps/sdk';

init();
configure();

// And that's all. We will now receive Telegram Mini Apps events
// and the SDK will properly process some of the special events
// sent from the Telegram application.
//
// Now we can also use the postEvent function.
```

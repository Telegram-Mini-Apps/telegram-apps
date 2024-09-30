# Events

This article covers topics related to [apps communication](../../platform/apps-communication.md)
events.

## Define Event Handlers

To avoid side effects, this package does not call any functions upon import. Telegram Mini Apps
require a specific way of communication between the native Telegram app and the mini application,
which involves defining certain methods in the global `window` object.

To enable this and start receiving Telegram Mini Apps events, use the `defineEventHandlers`
function:

```typescript
import { defineEventHandlers } from '@telegram-apps/bridge';

defineEventHandlers();
```

This setup ensures that the mini app can properly interact with the native Telegram app by listening
for and handling the necessary events.

## `on` and `off`

To start working with events, the `on` and `off` functions are used.

Here’s a basic example of the `on` function:

```typescript
import { on } from '@telegram-apps/bridge';

// Start listening to the "viewport_changed" event. The returned value
// is a function that removes this event listener.
const removeListener = on('viewport_changed', (payload) => {
  console.log('Viewport changed:', payload);
});

// Remove this event listener.
removeListener();
```

Alternatively, to stop listening to events, a developer can use the `off` function:

```typescript
import { on, off, type EventListener } from '@telegram-apps/bridge';

const listener: EventListener<'viewport_changed'> = (payload) => {
  console.log('Viewport changed:', payload);
};

// Start listening to the event.
on('viewport_changed', listener);

// Remove the event listener.
off('viewport_changed', listener);
```

To call the listener only once, the third boolean argument is used:

```typescript
import { on } from '@telegram-apps/bridge';

// Will automatically be removed after the first listener execution.
on('viewport_changed', (payload) => {
  console.log('Viewport changed:', payload);
}, true);
```

## `subscribe` and `unsubscribe`

To listen to all events sent from the native Telegram application, the `subscribe`
and `unsubscribe` functions are used:

```typescript
import {
  subscribe,
  unsubscribe,
  type SubscribeListener,
} from '@telegram-apps/bridge';

const listener: SubscribeListener = (event) => {
  console.log('Received event', event);
};

// Listen to all events.
subscribe(listener);

// Remove the listener.
unsubscribe(listener);
```

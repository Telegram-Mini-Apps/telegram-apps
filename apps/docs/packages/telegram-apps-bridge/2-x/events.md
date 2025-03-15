# Events

This article covers topics related to [apps communication](../../platform/apps-communication.md)
events.

## Tracking Events

To start tracking events, use the `on`. It returns a new function, removing the bound event
listener.

```typescript
import { on } from '@telegram-apps/bridge';

// Start listening to the "viewport_changed" event. The returned value
// is a function that removes this event listener.
const removeListener = on('viewport_changed', (payload) => {
  console.log('Viewport changed:', payload);
  // Remove this event listener.
  removeListener();
});
```

Alternatively, to stop listening to the event, a developer can use the `off` function:

```typescript
import { on, off, type EventListener } from '@telegram-apps/bridge';

const listener: EventListener<'viewport_changed'> = (payload) => {
  console.log('Viewport changed:', payload);
  // Remove the event listener.
  off('viewport_changed', listener);
};

// Start listening to the event.
on('viewport_changed', listener);

```

### One-Time Listener

To call the listener only once and remove it after, the third boolean argument is used:

```typescript
import { on } from '@telegram-apps/bridge';

// the listener will automatically be removed after the first 
// its execution.
on('viewport_changed', payload => {
  console.log('Viewport changed:', payload);
}, true);
```

### Wildcard Listener

In case, it is required to track all events, pass the `*` value as the first argument. In this case,
the listener will receive a tuple containing two elements: the event name and its payload.

```ts
import { on } from '@telegram-apps/bridge';

on('*', event => {
  if (event[0] === 'viewport_changed') {
    console.log('Viewport changed:', event[1]);
    return;
  }
  // ...
});
```

> [!TIP] Why tuple?
> The listener receives a tuple for better typing when using TypeScript.

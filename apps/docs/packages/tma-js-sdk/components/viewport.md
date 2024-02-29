# `Viewport`

Implements Telegram Mini
Apps [viewport](../../../platform/viewport.md) functionality.

## Initialization

The component constructor accepts an object with specified viewport height, width, stable height,
expansion state, and an optional function to call Telegram Mini Apps methods.

```typescript  
import { Viewport, postEvent } from '@tma.js/sdk';

const viewport = new Viewport({
  height: 390,
  width: 365,
  stableHeight: 300,
  isExpanded: false,
  postEvent,
});
```  

## Dimensions

The application can display just the top part of the Mini App, with its lower part remaining outside
the screen area. From this position, the user can "pull" the Mini App to its maximum height, while
the developer can do the same by calling `expand` method (use `isExpanded` prop to get current
expansion state). As the position of the Mini App changes, the current height value of the visible
area will be updated in real time.

::: info
Please note that the refresh rate of this value (`height`) is not sufficient to smoothly follow the
lower border of the window. It should not be used to pin interface elements to the bottom of the
visible area. It's more appropriate to use the value of the `stableHeight` field for this purpose.
:::

## Requesting actual data

To get actual viewport information, developer could use `requestViewport` function:

```typescript
import { requestViewport } from '@tma.js/sdk';

requestViewport().then((data) => {
  // Output:
  // { height: 122, isExpanded: false, width: 375, isStateStable: true }
  console.log(data);
});
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event               | Listener                          | Triggered when                  |
|---------------------|-----------------------------------|---------------------------------|
| change              | `() => void`                      | Something in component changed  |
| change:height       | `(height: number) => void`        | `height` property changed       |
| change:isExpanded   | `(isExpanded: boolean) => void`   | `isExpanded` property changed   |
| change:stableHeight | `(stableHeight: boolean) => void` | `stableHeight` property changed |
| change:width        | `(width: boolean) => void`        | `width` property changed        |

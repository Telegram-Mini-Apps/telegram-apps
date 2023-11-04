# `Viewport`

The component which contains an information about the current Mini App
device [viewport](../../../../functionality/viewport.md), its dimensions and state.

## Initialization

Component constructor accepts viewport height, width, stable height, expansion state and optional
function to call Telegram Mini Apps methods.

```typescript  
import { postEvent } from '@tma.js/bridge';
import { Viewport } from '@tma.js/sdk';

const viewport = new Viewport(390, 365, 300, false, postEvent);
```  

## Dimensions

The application can display just the top part of the Mini App, with its lower part remaining outside
the screen area. From this position, the user can "pull" the Mini App to its maximum height, while
the developer can do the same by calling `expand` method (use `isExpanded` prop to get current
expansion state). As the position of the Mini App changes, the current height value of the visible
area will be updated in real time.

::: note
Please note that the refresh rate of this value is not sufficient to smoothly follow the lower
border of the window. It should not be used to pin interface elements to the bottom of the visible
area. It's more appropriate to use the value of the `stableHeight` field for this purpose.
:::

## Requesting actual data

To get actual viewport information, developer could use static `request()` method:

```typescript
import { Viewport } from '@tma.js/sdk';

Viewport.request().then(console.log);

// Output:
// { height: 122, isExpanded: false, width: 375, isStateStable: true }
```

## Creating synchronized instance

Class is capable of returning instance of `Viewport` which is synchronized with its actual state in
Telegram application. To get it, use static `synced` method:

```typescript
import { Viewport } from '@tma.js/sdk';

const viewport = await Viewport.synced();

console.log(viewport.height); // 390
console.log(viewport.stableHeight); // 300
console.log(viewport.width); // 365
console.log(viewport.isExpanded); // false
console.log(viewport.isStable); // false
```

Synchronized instance contains actual parameters values. It also being updated in case, parameters
are changing in the native Telegram application.

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `heightChanged: (height: number) => void`
- `isExpandedChanged: (isExpanded: boolean) => void`
- `stableHeightChanged: (stableHeight: number) => void`
- `widthChanged: (width: number) => void`

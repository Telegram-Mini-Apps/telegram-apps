# `Viewport`

The component which contains an information about the current Web App device 
viewport, its dimensions and state.

## Initialization

```typescript  
import {Viewport} from '@twa.js/sdk';  
import {Bridge} from '@twa.js/bridge';  
  
// Specify bridge instance, height, width, stable height and
// expansion status.
const viewport = new Viewport(
  Bridge.init(), 390, 365, 300, false,
);  
```  

## Dimensions

The `Viewport` instance contains information about viewport dimensions. We can
get current visible are height and width via `height` and `width` properties.

The application can display just the top part of the Web App, with its lower
part remaining outside the screen area. From this position, the user can "pull"
the Web App to its maximum height, while the bot can do the same by
calling `expand` method (use `isExpanded` prop to get current expansion state).
As the position of the Web App changes, the current height value of the visible
area will be updated in real time.

Please note that the refresh rate of this value is not sufficient to smoothly
follow the lower border of the window. It should not be used to pin interface
elements to the bottom of the visible area. It's more appropriate to use the
value of the `stableHeight` field for this purpose.

## Requesting the viewport information

To get fresh viewport information, you could use static `request` function:

```typescript
import {Viewport} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

Viewport.request(Bridge.init()).then(console.log);

// Output:
// { height: 122, isExpanded: false, width: 375, isStateStable: true }
```

## Creating synchronized instance

Class is capable of returning instance of `Viewport` which
is synchronized with its actual state in Telegram application. To
get it, use static `synced()` method:

```typescript
import {Viewport} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

const viewport = Viewport.synced(
  Bridge.init(), 390, 365, 300, false,
);

// viewport will be automatically updated in case, 
// Telegram changed viewport.

console.log(viewport.height); // 390
console.log(viewport.stableHeight); // 300
console.log(viewport.width); // 365
console.log(viewport.isExpanded); // false
console.log(viewport.isStable); // false
```

## Events

Events available for [listening](../about#events):

- `heightChanged: (height: number) => void`
- `widthChanged: (width: number) => void`
- `stableHeightChanged: (stableHeight: number) => void`
- `isExpandedChanged: (isExpanded: boolean) => void`

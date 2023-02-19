# `ThemeParams`

Contains information about currently used theme by application.

To learn more, visit description of this feature
in [documentation](../../../features/theme).

## Init

```typescript  
import {ThemeParams} from '@twa.js/sdk';
  
const themeParams = new ThemeParams({});  
```

## Requesting fresh theme params

To get fresh theme parameters information, you could use `request` static
function:

```typescript
import {init} from '@twa.js/bridge';

ThemeParams.request(init()).then(console.log);

// Output:
// { backgroundColor: '#aabbcc', ... }
```

## Creating synchronized instance

Class is capable of returning an instance of `ThemeParams` which
is synchronized with its actual state in the Telegram application. To
get it, use static `synced()` method:

```typescript
import {ThemeParams} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

const tp = ThemeParams.synced(init(), {
  backgroundColor: '#ffaacc',
  buttonColor: '#1123aa',
  buttonTextColor: '#aadfbb',
  hintColor: '#113123',
  linkColor: '#ffaacc',
  secondaryBackgroundColor: '#cccccc',
  textColor: '#000000',
});

// tp will be automatically updated in case, Telegram changed
// theme parameters.
```

## Colors

List of colors, provided by `ThemeParams`:

- `backgroundColor: RGB`
- `buttonColor: RGB`
- `buttonTextColor: RGB`
- `hintColor: RGB`
- `linkColor: RGB`
- `secondaryBackgroundColor: RGB | null`
- `textColor: RGB`

## Events

Events available for [listening](../about#events):

- `change: () => void`
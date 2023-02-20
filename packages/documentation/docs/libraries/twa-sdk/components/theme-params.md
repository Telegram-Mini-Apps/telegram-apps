# `ThemeParams`

The component which contains an information about currently used theme by 
the application. There is more information about this component in this
[documentation](../../../features/theme.md).

## Initialization

```typescript  
import {ThemeParams} from '@twa.js/sdk';
  
const themeParams = new ThemeParams({
  backgroundColor: '#ffaabb',
  buttonColor: '#113222',
  buttonTextColor: '#aabc33',
  hintColor: '#00ff00',
  linkColor: '#a32213',
  secondaryBackgroundColor: '#000000',
  textColor: '#aaaaaa',
});  
```

## Requesting fresh theme params

To get the fresh theme parameters information, developer could use the 
`request` static method:

```typescript
import {Bridge} from '@twa.js/bridge';

ThemeParams.request(Bridge.init()).then(console.log);

// Output:
// { backgroundColor: '#ffaabb', ... }
```

## Creating the synchronized instance

The `ThemeParams` is capable of returning an instance of `ThemeParams` which
is synchronized with its actual state in the Telegram application. To
get it, use static the `synced()` method:

```typescript
import {ThemeParams} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

const themeParams = ThemeParams.synced(Bridge.init(), {
  backgroundColor: '#ffaacc',
  buttonColor: '#1123aa',
  buttonTextColor: '#aadfbb',
  hintColor: '#113123',
  linkColor: '#ffaacc',
  secondaryBackgroundColor: '#cccccc',
  textColor: '#000000',
});

// themeParams will be automatically updated in case, Telegram changed
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
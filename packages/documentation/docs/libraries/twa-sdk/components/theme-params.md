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
function. It will return `TwaThemeParams` interface from `twa-theme-params`
package:

```typescript
import {init} from '@twa.js/bridge';

ThemeParams.request(init()).then(console.log);

// Output:
// { backgroundColor: '#aabbcc', ... }
```

## Creating synchronized instance

Class is capable of returning instance of `ThemeParams` which
is synchronized with its actual state in Telegram application. To
get it, use static `synced()` method:

```typescript
import {ThemeParams} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

const tp = ThemeParams.synced(init(), {});

// tp will be automatically updated in case, Telegram changed
// theme parameters.
```

## Colors

Class contains list of colors, which could be either `RGB` or `null`:

- `backgroundColor`
- `buttonColor`
- `buttonTextColor`
- `hintColor`
- `linkColor`
- `secondaryBackgroundColor`
- `textColor`

## Events

Events available for [listening](../about#events):

- `change: () => void`
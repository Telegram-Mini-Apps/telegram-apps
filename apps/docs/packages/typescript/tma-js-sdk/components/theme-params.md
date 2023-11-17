# `ThemeParams`

The component which contains an information about currently
used [theme](../../../../platform/functionality/theming.md) by the Telegram application.

## Initialization

Component constructor accepts an object with where each key describes the palette key and
value specifies its color.

```typescript  
import { ThemeParams } from '@tma.js/sdk';

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

## Requesting actual data

To get the actual theme parameters information, developer could use the `request()` static method:

```typescript
import { ThemeParams } from '@tma.js/sdk';

ThemeParams.request().then(console.log);

// Output:
// { backgroundColor: '#ffaabb', ... }
```

## Creating synchronized instance

The `ThemeParams` is capable of returning an instance of `ThemeParams` which is synchronized with
its actual state in the Telegram application. To get it, use static the `synced()` method:

```typescript
import { ThemeParams } from '@tma.js/sdk';

const themeParams = await ThemeParams.synced();
```

Synchronized instance contains actual parameters values. It is also being updated in case,
parameters are changing in the native Telegram application.

## Colors

List of colors, provided by `ThemeParams`:

- `backgroundColor: RGB | null`
- `buttonColor: RGB | null`
- `buttonTextColor: RGB | null`
- `hintColor: RGB | null`
- `linkColor: RGB | null`
- `secondaryBackgroundColor: RGB | null`
- `textColor: RGB | null`

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `changed: () => void`

# `ThemeParams`

The component which contains an information about currently
used [theme](../../../platform/theming.md) by the Telegram application.

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

To get the actual theme parameters information, developer could use the `requestThemeParams`
function:

```typescript
import { requestThemeParams } from '@tma.js/sdk';

requestThemeParams.then(console.log);

// Output:
// { backgroundColor: '#ffaabb', ... }
```

## Colors

The developer can retrieve the theme color by using the `get` method:

```typescript
themeParams.get('backgroundColor');
themeParams.get('packageUnknownColor');
```

To retrieve all colors via one object, use `getState` method:

```typescript
themeParams.getState();
// Output:
// {
//   accentTextColor: '#aa1399',
//   backgroundColor: '#baac12',
//   linkColor: '#887722'
//   packageUnknownColor: '#676767,
// }
```

The `ThemeParams` component provides direct access to the list of colors:

- `accentTextColor: RGB | undefined`
- `backgroundColor: RGB | undefined`
- `buttonColor: RGB | undefined`
- `buttonTextColor: RGB | undefined`
- `destructiveTextColor: RGB | undefined`
- `headerBackgroundColor: RGB | undefined`
- `hintColor: RGB | undefined`
- `linkColor: RGB | undefined`
- `secondaryBackgroundColor: RGB | undefined`
- `sectionBackgroundColor: RGB | undefined`
- `sectionHeaderTextColor: RGB | undefined`
- `subtitleTextColor: RGB | undefined`
- `textColor: RGB | undefined`

Example:

```typescript
themeParams.accentTextColor; // '#aa1399'
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event                | Listener               | Triggered when                   |
|----------------------|------------------------|----------------------------------|
| change               | `() => void`           | Something in component changed   |
| change:\{theme_key\} | `(value: RGB) => void` | Color with specified key changed |
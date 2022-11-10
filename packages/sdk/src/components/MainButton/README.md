# MainButton

Controls the main button, which is displayed at the bottom of the Web App in the
Telegram interface.

## Usage

To create new empty instance of `MainButton`, we don't need any parameters:

```typescript
import {BackButton} from 'twa-client-sdk';

const mainButton = new MainButton();
```

Nevertheless, it is allowed to specify initial parameters and `Bridge` instance:

```typescript
import {BackButton} from 'twa-client-sdk';
import {Bridge} from 'twa-bridge';

const mainButton = new MainButton({
  bridge: Bridge.init(),
  color: '#aa6711',
  isActive: false,
  isVisible: true,
  isProgressVisible: false,
  text: 'Submit',
  textColor: '#ff90a1',
});
```

Remember, that all of these parameters are optional.

### Committing changes

As long as by default, locally applied changes are not automatically sent to
native application, it is required to do it via calling of function
named `commit`:

```typescript
const mainButton = new MainButton();

mainButton.setText('Submit').show().commit();
```

This code will update main button text to `Submit`, make it visible
and commit changes. We use this logic to prevent unexpected visual changes
to be sent while just updating main button props locally.

You could use `autocommit` mode while creating new instance of `MainButton`:

```typescript
const mainButton = new MainButton({autocommit: true});

mainButton.setText('Submit').show();
```

This will lead to automatic call of `commit` function after usage of any
setter.

### Properties

| Property                     | Setter                              | Description                                                                                           |
|------------------------------|-------------------------------------|-------------------------------------------------------------------------------------------------------|
| `color: RGBColor`            | `setColor(color: RGBColor)`         | Button color                                                                                          |
| `textColor: RGBColor`        | `setTextColor(color: RGBColor)`     | Button text color                                                                                     |
| `text: string`               | `setText(text: string)`             | Button displayed text. Formatted (space-trimmed) text length should from 1 to 64 symbols inclusively. |
| `isActive: boolean`          | `enable()` / `disable()`            | Is button enabled (able to be clicked)                                                                |
| `isVisible: boolean`         | `show()` / `hide()`                 | Is button visible                                                                                     |
| `isProgressVisible: boolean` | `showProgress()` / `hideProgress()` | Is progress loader visible                                                                            |

Each of the color setters requires passing color in format, which is able to be
converted to `#RRGGBB` form. To see, what formats are supported, look into
the [implementation](https://github.com/Telegram-Web-Apps/core/blob/master/src/colors/rgb.ts)
of `toRGB` function.

### Events

#### Common usage

`MainButton` follows default way of events listening through `on` and `off`
functions:

```typescript
const listener = (...args) => { ... };

mainButton.on(event, listener);
mainButton.off(event, listener);
```

#### Main button clicked

```typescript
// Show main button.
mainButton.setText('Submit').enable().show();

// When user clicked main button, we hide it.
mainButton.on('click', () => mainButton.hide());
```

#### Property-connected events

This list of events is main button properties connected and is being called
whenever property changes:

- `activeChange: (isActive: boolean) => void`
- `colorChange: (color: RGBColor) => void`
- `progressVisibleChange: (isVisible: boolean) => void`
- `textChange: (text: string) => void`
- `textColorChange: (color: RGBColor) => void`
- `visibleChange: (isVisible: boolean) => void`

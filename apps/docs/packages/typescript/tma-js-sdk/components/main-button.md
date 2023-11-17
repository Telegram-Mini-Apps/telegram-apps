# `MainButton`

The component which controls the [Main Button](../../../../platform/ui/main-button.md).

## Initialization

Component constructor accepts background color, activity state, visibility state, progress
visibility state, text and its color. It also accepts optional function to call Telegram Mini Apps
methods.

```typescript
import { postEvent } from '@tma.js/bridge';
import { BackButton } from '@tma.js/sdk';

const mainButton = new MainButton(
  '#aaddfe',
  false,
  false,
  false,
  'SUBMIT',
  '#ffffff',
  postEvent,
);
```

## Button visibility

To control the `MainButton` visibility, develoepr could use such methods as `show()` and `hide()`.
Both of them update component's `isVisible` property:

```typescript  
mainButton.show();
console.log(mainButton.isVisible); // true  

mainButton.hide();
console.log(mainButton.isVisible); // false  
```

## Loader

The `MainButton` could display a loader inside of it. To control its visibility,
use `showProgress()` and `hideProgress()` methods. The `isProgressVisible` property will be changed.

```typescript
mainButton.showProgress();
console.log(mainButton.isProgressVisible); // true  

mainButton.hideProgress();
console.log(mainButton.isProgressVisible); // false
```

## Active state

The `MainButton` can be enabled and disabled by calling `disable()` and `enable()` methods. Both of
the methods will update the `isEnabled` property.

```typescript
mainButton.enable();
console.log(mainButton.isEnabled); // true  

mainButton.disable();
console.log(mainButton.isEnabled); // false
```

Enabling the `MainButton` will allow a user to click it. As the result, the `MainButton` will
receive the `click` event. Otherwise, no event will be received.

## Background color

To update the `MainButton` background color, use the `setBackgroundColor(color: RGB)` method. It
will update the `backgroundColor` property.

```typescript 
mainButton.setBackgroundColor('#ffffaa');
console.log(mainButton.color); // '#ffffaa'
```

## Text color

To update the `MainButton` text color, use the `setTextColor(color: RGB)` method. It will update
the `textColor` property.

```typescript 
mainButton.setTextColor('#cca233');
console.log(mainButton.textColor); // '#cca233'
```

## Text

To update the `MainButton` text, use the `setText(text: string)` method. It will update the `text`
property.

```typescript
mainButton.setText('Submit');
console.log(mainButton.text); // 'Submit'
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

- `backgroundColorChanged: (color: RGB) => void`
- `click: () => void`
- `isProgressVisibleChanged: (isVisible: boolean) => void`
- `isEnabledChanged: (isEnabled: boolean) => void`
- `isVisibleChanged: (isVisible: boolean) => void`
- `textChanged: (text: string) => void`
- `textColorChanged: (color: RGB) => void`

# `MainButton`

Controls the main button, which is displayed at the bottom of the Web App in the
Telegram interface.

To learn more, visit description of this feature
in [documentation](../../../features/main-button).

## Init

```typescript
import {BackButton} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

// Specify bridge instance, color and text colors.
const mainButton = new MainButton(init(), '#000000', '#ffffff');
```

## Methods and properties

### Visibility

#### Button

To control `MainButton` visibility, you could use such property as `isVisible`.
It is being changed during the call of `show()` and `hide()` methods:

```typescript  
mainButton.show();  
console.log(mainButton.isVisible); // true  
  
mainButton.hide();  
console.log(mainButton.isVisible); // false  
```

#### Loader

`MainButton` could display loader inside of it. To control its visibility,
use `showProgress()` and `hideProgress()` methods. `isProgressVisible` property
will be changed.

```typescript
mainButton.showProgress();
console.log(mainButton.isProgressVisible); // true  

mainButton.hideProgress();
console.log(mainButton.isProgressVisible); // false
```

### Active state

You could disable `MainButton` by calling `disable()` method and enable it
via `enable()`. Both of the methods will update the `isEnabled` property.

```typescript
// Enable button.  
mainButton.enable();
console.log(mainButton.isEnabled); // true  

// Disable button.  
mainButton.disable();
console.log(mainButton.isEnabled); // false
```

Enabling main button will allow user to click it. As the result, `MainButton`
will receive the `click` event. Otherwise, no event will be received.

### Colors

#### Background

To update `MainButton` background color, use the `setColor(color: RGB)` method.
It will update `color` property.

```typescript 
mainButton.setColor('#ffffaa');
console.log(mainButton.color); // '#ffffaa'
```

#### Text

To update `MainButton` text color, use the `setTextColor(color: RGB)` method.
It will update `textColor` property.

```typescript 
mainButton.setTextColor('#cca233');
console.log(mainButton.textColor); // '#cca233'
```

## Events

Events available for [listening](../about#events):

- `click: () => void`
- `colorChanged: (color: RGB) => void`
- `isProgressVisibleChanged: (isVisible: boolean) => void`
- `isEnabledChanged: (isEnabled: boolean) => void`
- `isVisibleChanged: (isVisible: boolean) => void`
- `textChanged: (text: string) => void`
- `textColorChanged: (color: RGB) => void`

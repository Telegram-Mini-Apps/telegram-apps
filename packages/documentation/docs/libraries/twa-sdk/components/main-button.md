# `MainButton`

The component which controls the main button, which is displayed at the 
bottom of the Web App in the Telegram interface. There is more information 
about this component in this
[documentation](../../../features/main-button).

## Initialization

```typescript
import {BackButton} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

// Specify bridge instance, color and text colors.
const mainButton = new MainButton(Bridge.init(), '#000000', '#ffffff');
```

## Methods and properties

### Visibility

#### Button

To control the `MainButton` visibility, you could use such property as 
`isVisible`. It is being changed during the call of `show()` and `hide()` 
methods:

```typescript  
mainButton.show();  
console.log(mainButton.isVisible); // true  
  
mainButton.hide();  
console.log(mainButton.isVisible); // false  
```

#### Loader

The `MainButton` could display a loader inside of it. To control its 
visibility, use `showProgress()` and `hideProgress()` methods. 
The `isProgressVisible` property will be changed.

```typescript
mainButton.showProgress();
console.log(mainButton.isProgressVisible); // true  

mainButton.hideProgress();
console.log(mainButton.isProgressVisible); // false
```

### Active state

The `MainButton` can be enabled and disabled by calling `disable()` and
`enable()` methods. Both of the methods will update the `isEnabled` property.

```typescript
mainButton.enable();
console.log(mainButton.isEnabled); // true  

mainButton.disable();
console.log(mainButton.isEnabled); // false
```

Enabling the `MainButton` will allow a user to click it. As the result, 
the `MainButton` will receive the `click` event. Otherwise, no event will be 
received.

### Colors

#### Background

To update the `MainButton` background color, use the `setColor(color: RGB)` method.
It will update the `color` property.

```typescript 
mainButton.setColor('#ffffaa');
console.log(mainButton.color); // '#ffffaa'
```

#### Text

To update the `MainButton` text color, use the `setTextColor(color: RGB)` method.
It will update the `textColor` property.

```typescript 
mainButton.setTextColor('#cca233');
console.log(mainButton.textColor); // '#cca233'
```

## Events

Events available for the [listening](../about#events):

- `click: () => void`
- `colorChanged: (color: RGB) => void`
- `isProgressVisibleChanged: (isVisible: boolean) => void`
- `isEnabledChanged: (isEnabled: boolean) => void`
- `isVisibleChanged: (isVisible: boolean) => void`
- `textChanged: (text: string) => void`
- `textColorChanged: (color: RGB) => void`

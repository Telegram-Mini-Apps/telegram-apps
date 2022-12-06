# `MainButton`

Controls the main button, which is displayed at the bottom of the Web App in the
Telegram interface.

To learn more, visit description of this feature
in [documentation](../../../features/main-button).

## Init

```typescript
import {BackButton} from 'twa-sdk';
import {init} from 'twa-bridge';

const mainButton = new MainButton();
// or with your bridge instance.  
const mainButton = new MainButton({bridge: init()});
```

## Committing changes

By default, `MainButton` instance automatically applies changes, done
by setters, such as `setText`, `show` etc. This behavior could be change by
using `autocommit` constructor property:

```typescript
const mainButton = new MainButton({autocommit: false});
```

In this case, to apply locally done changes, you have to call `commit()` 
function:

```typescript
const mainButton = new MainButton({autocommit: false});
mainButton.setText('Submit').show().commit();
```

This code will change main button text to `Submit`, make it visible
and commit changes. We use commit function to prevent unexpected visual changes
to be sent while just updating main button props locally.

## Controlling visibility

```typescript  
// Show main button.  
mainButton.show();  
console.log(mainButton.isVisible); // true  
  
// Hide main button.  
mainButton.hide();  
console.log(mainButton.isVisible); // false  
```

## Displaying loader

```typescript
// Show main button loader.  
mainButton.showProgress();
console.log(mainButton.isProgressVisible); // true  

// Hide main button loader.  
mainButton.hideProgress();
console.log(mainButton.isProgressVisible); // false
```

## Colors

### `color` / `setColor(color: RGBColor)`

Button background color.

```typescript 
mainButton.setColor('#ffffaa');
console.log(mainButton.color); // '#ffffaa'
```

### `textColor` / `setTextColor(color: RGBColor)`

Button text color.

```typescript 
mainButton.setTextColor('#cca233');
console.log(mainButton.textColor); // '#cca233'
```

## Enable state

```typescript
// Enable button.  
mainButton.enable();
console.log(mainButton.isActive); // true  

// Disable button.  
mainButton.disable();
console.log(mainButton.isActive); // false
```

Enabling main button will allow user to click it. As a result, main button
will receive `click` event. Otherwise, no event will be received.

## Events

Events available for [listening](../about#events):

- `activeChange: (isActive: boolean) => void`
- `click: () => void`
- `colorChange: (color: RGBColor) => void`
- `progressVisibleChange: (isVisible: boolean) => void`
- `textChange: (text: string) => void`
- `textColorChange: (color: RGBColor) => void`
- `visibleChange: (isVisible: boolean) => void`

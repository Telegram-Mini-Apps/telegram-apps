# `MainButton`

Controls the main button, which is displayed at the bottom of the Web App in the
Telegram interface.

## Usage

### Init

```typescript
import {BackButton} from 'twa-sdk';

const mainButton = new MainButton();
```

### Committing changes

As long as by default, locally applied changes are not automatically sent to
native application, it is required to do it via calling `commit` function:

```typescript
mainButton.setText('Submit').show().commit();
```

This code will update main button text to `Submit`, make it visible
and commit changes. We use commit function to prevent unexpected visual changes
to be sent while just updating main button props locally.

You could use `autocommit` mode while creating new instance of `MainButton`:

```typescript
const mainButton = new MainButton({autocommit: true});

mainButton.setText('Submit').show();
```

This will lead to automatic call of `commit` function after usage any of
setters.

### Controlling visibility

```typescript  
// Show main button.  
mainButton.show();  
console.log(mainButton.isVisible); // true  
  
// Hide main button.  
mainButton.hide();  
console.log(mainButton.isVisible); // false  
```

### Displaying loader

Main button is capable of displaying loading indicator inside it.

```typescript
// Show main button loader.  
mainButton.showProgress();  
console.log(mainButton.isProgressVisible); // true  
  
// Hide main button loader.  
mainButton.hideProgress();  
console.log(mainButton.isProgressVisible); // false
```

### Colors

`MainButton` has 2 colors:

- `color` - `setColor(color: RGBColor)` - button background color;
- `textColor` - `setTextColor(color: RGBColor)` - button text color;

### Enable state

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

### Events

Events available for [listening](../../../README.md#events-listening) :

- `activeChange: (isActive: boolean) => void`
- `click: () => void`
- `colorChange: (color: RGBColor) => void`
- `progressVisibleChange: (isVisible: boolean) => void`
- `textChange: (text: string) => void`
- `textColorChange: (color: RGBColor) => void`
- `visibleChange: (isVisible: boolean) => void`

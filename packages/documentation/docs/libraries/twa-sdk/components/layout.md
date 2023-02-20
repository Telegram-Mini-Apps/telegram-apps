# `Layout`

The class which provides information about the current Web App layout.

## Initialization

```typescript  
import {Layout} from '@twa.js/sdk';  
import {Bridge} from '@twa.js/bridge';  

// Specify bridge instance, Web Apps version, header and background colors.
const layout = new Layout(Bridge.init(), '6.3', 'bg_color', '#ffaabb');  
```  

## Methods and properties

### Background color

To update the Web App background color, it is required to use
`setBackgroundColor(color: RGB)` method. Locally, it updates the
`backgroundColor: RGB` property:

```typescript
layout.setBackgroundColor('#ffaacc');
console.log(layout.backgroundColor); // #ffaacc
```

### Header color

To update the Web App header color, it is required to use
`setHeaderColor(color: HeaderColorKey)` method. Locally, it updates the
`headerColor: HeaderColorKey` property:

```typescript
layout.setHeaderColor('bg_color');
console.log(layout.headerColor); // bg_color
```

### Color scheme

The `Layout` component allows returning the current color scheme based on the 
actual background color. To get the current color scheme (`dark` or `light`), 
a developer should use the `colorScheme` property:

```typescript
console.log(layout.colorScheme); // dark
```

## Events

Events available for the [listening](../about#events):

- `backgroundColorChanged: (color: RGB) => void`
- `headerColorChanged: (color: HeaderColorKey) => void`

## Methods support

Methods available for the [support check](../about#methods-support):

- `setHeaderColor`
- `setBackgroundColor`  
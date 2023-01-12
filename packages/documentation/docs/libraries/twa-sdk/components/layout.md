# `Layout`

Class which provides information about current Web App layout.

## Init

```typescript  
import {Layout} from 'twa-sdk';  
import {init} from 'twa-bridge';  

// Specify bridge instance, Web Apps version, header and background colors.
const layout = new Layout(init(), '6.3', 'bg_color', '#ffaabb');  
```  

## Colors

Component provides access to header and background colors control.

### `backgroundColor` / `setBackgroundColor(color: RGB)`

Application background color.

```typescript
layout.setBackgroundColor('#ffaacc');
console.log(layout.backgroundColor); // #ffaacc
```

### `headerColor` / `setHeaderColor(color: HeaderColorKey)`

Application header color.

```typescript
layout.setHeaderColor('bg_color');
console.log(layout.headerColor); // bg_color
```

### `colorScheme: 'dark' | 'light'`

To get current color scheme (`dark` or `light`), you can use `colorScheme`
property:

```typescript
console.log(layout.colorScheme); // dark
```

This property is computed depending on current `backgroundColor`.

## Events

Events available for [listening](../about#events):

- `backgroundColorChanged: (color: RGB) => void`
- `headerColorChanged: (color: HeaderColorKey) => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `setHeaderColor`
- `setBackgroundColor`  
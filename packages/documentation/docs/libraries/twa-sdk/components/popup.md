# `Popup`

The component which controls the currently displayed application popup. It 
allows developers to open new custom popups and detect popup-connected events.
There is more information about this component in this
[documentation](../../../features/popup).

## Initialization

```typescript
import {Popup} from '@twa.js/sdk';
import {Bridge} from '@twa.js/bridge';

const popup = new Popup(Bridge.init(), '6.3');
```

## Opening new popup

The `open` function returns a promise which will be resolved in case, the 
opened popup was closed. `Popup` will resolve a button identifier in case, 
a user clicked it. Otherwise, `null` will be resolved.

```typescript
popup.open({
  title: 'Hello!',
  message: 'Here is a test message.',
  buttons: [{id: 'my-id', type: 'default', text: 'Default text'}]
});
console.log(popup.isOpened); // true
```

## Events

Events available for the [listening](../about#events):

- `isOpenedChanged: (isOpened: boolean) => void`

## Methods support

Methods available for the [support check](../about#methods-support):

- `open`
# `Popup`

Controls currently displayed application popup. It allows developers to open new
custom popups and detect popup-connected events.

To learn more, visit description of this feature
in [documentation](../../../features/popup).

## Init

```typescript
import {Popup} from 'twa-sdk';
import {init} from 'twa-bridge';

const popup = new Popup();
// or with your bridge.  
const popup = new Popup({bridge: init()});
```

## Opening new popup

`show` function returns promise which will be resolved in case, popup is hidden.
Popup will resolve button identifier in case, user clicked it. Otherwise,
`null` will be resolved.

```typescript
popup.show({
  title: 'Hello!',
  message: 'Here is a test message.',
  buttons: [{id: 'my-id', type: 'default', text: 'Default text'}]
});
console.log(popup.isOpened); // true
```

There are some additional shorthand functions using `show` function for showing
popups which way also be useful:

```typescript
// Will show popup with only 1 button. Could be used as alert. 
popup.showAlert('This page will be closed in 2 minutes.');

// Show confirm message.
popup.showConfirm('Are you sure, this form should be closed?').then(value => {
  // value will be true or false.
})
```

## Events

Events available for [listening](../about#events):

- `close: () => void`
- `openChange: (isOpened: boolean) => void`
- `open: () => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `show`
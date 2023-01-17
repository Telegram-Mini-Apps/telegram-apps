# `Popup`

Controls currently displayed application popup. It allows developers to open new
custom popups and detect popup-connected events.

To learn more, visit description of this feature
in [documentation](../../../features/popup).

## Init

```typescript
import {Popup} from '@twa.js/sdk';
import {init} from '@twa.js/bridge';

const popup = new Popup(init(), '6.3');
```

## Opening new popup

`open` function returns promise which will be resolved in case, popup is hidden.
Popup will resolve button identifier in case, user clicked it. Otherwise,
`null` will be resolved.

```typescript
popup.open({
  title: 'Hello!',
  message: 'Here is a test message.',
  buttons: [{id: 'my-id', type: 'default', text: 'Default text'}]
});
console.log(popup.isOpened); // true
```

## Events

Events available for [listening](../about#events):

- `openChanged: (isOpened: boolean) => void`

## Methods support

Methods available for [support check](../about#methods-support):

- `open`
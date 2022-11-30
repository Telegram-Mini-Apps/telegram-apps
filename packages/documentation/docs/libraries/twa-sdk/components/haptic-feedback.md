# `HapticFeedback`

Controls haptic feedback. It allows calling different types of
haptic notifications which usually occur after user interaction with
application.

## Init

```typescript
import {HapticFeedback} from 'packages/sdk/dist/index';
import {Bridge} from 'packages/bridge/dist/index';

const haptic = new HapticFeedback();
// or
const haptic = new HapticFeedback({bridge: init()});
```

## Notifications

`HapticFeedback` supports 3 types of haptic events -
`impactOccurred`, `notificationOccurred` and `selectionChanged`:

```typescript
haptic.selectionChanged();
haptic.impactOccurred('medium');
haptic.notificationOccurred('success');
```

## Methods support

Methods available for [support check](../general#methods-support):

- `notificationOccurred`
- `impactOccurred`
- `selectionChanged`
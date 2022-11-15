# `HapticFeedback`

Controls haptic feedback. It allows calling different types of
haptic notifications which usually occur after user interaction with
application.

## Usage

### Init

```typescript
import {HapticFeedback} from 'twa-sdk';
import {Bridge} from 'twa-bridge';

const haptic = new HapticFeedback();
// or
const haptic = new HapticFeedback({bridge: init()});
```

### Notifications

`HapticFeedback` supports 3 types of haptic events -
`impactOccurred`, `notificationOccurred` and `selectionChanged`:

```typescript
haptic.selectionChanged();
haptic.impactOccurred('medium');
haptic.notificationOccurred('success');
```

### Methods support

Methods available for [support check](../../../README.md#methods-support):

- `notificationOccurred`
- `impactOccurred`
- `selectionChanged`
# HapticFeedback

Class which controls haptic feedback. It allows calling different types of
haptic notifications which usually occur after user interaction with
application.

## Usage

To create new instance of `HapticFeedback`, we need current Web App version
and optional `Bridge` instance.

```typescript
import {HapticFeedback} from 'twa-client-sdk';
import {Bridge} from 'twa-bridge';

const haptic = new HapticFeedback('6.1');
// or
const haptic = new HapticFeedback('6.1', Bridge.init());
```

### Haptic notifications

`HapticFeedback` supports 3 types of haptic events - 
`impactOccurred`, `notificationOccurred` and `selectionChanged`:

```typescript
haptic.selectionChanged();
haptic.impactOccurred('medium');
haptic.notificationOccurred('success');
```

[//]: # (TODO: Add guidance for usage of haptic events. We should point which)
[//]: # (notifications should be called in different cases.)
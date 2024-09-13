# Haptic Feedback

The scope responsible for the Telegram Mini
Apps [back button](../../../../platform/haptic-feedback.md).

## `impactOccurred`

A method tells that an impact occurred. The Telegram app may play the appropriate haptics based
on style value passed.

```ts
import { impactOccurred } from '@telegram-apps/sdk';

if (impactOccurred.isSupported()) {
  impactOccurred('medium');
}
```

Style of impact occurred haptic event:

- `light`, indicates a collision between small or lightweight UI objects,
- `medium`, indicates a collision between medium-sized or medium-weight UI objects,
- `heavy`, indicates a collision between large or heavyweight UI objects,
- `rigid`, indicates a collision between hard or inflexible UI objects,
- `soft`, indicates a collision between soft or flexible UI objects.

## `notificationOccurred`

A method tells that a task or action has succeeded, failed, or produced a warning. The Telegram
app may play the appropriate haptics based on type value passed.

```ts
import { notificationOccurred } from '@telegram-apps/sdk';

if (notificationOccurred.isSupported()) {
  notificationOccurred('success');
}
```

Type of notification occurred type event:

- `error`, indicates that a task or action has failed,
- `success`, indicates that a task or action has completed successfully,
- `warning`, indicates that a task or action produced a warning.

## `selectionChanged`

A method tells that the user has changed a selection. The Telegram app may play the
appropriate haptics.

Do not use this feedback when the user makes or confirms a selection; use it only when the
selection changes.

```ts
import { selectionChanged } from '@telegram-apps/sdk';

if (selectionChanged.isSupported()) {
  selectionChanged();
}
```
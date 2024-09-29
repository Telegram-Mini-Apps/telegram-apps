# Launch Parameters

Launch parameters are essential to the mini application lifecycle. To learn more about what launch
parameters are and their importance, it is worth reading [this](../../platform/launch-parameters.md)
article.

This package allows a developer to extract launch parameters from the current environment using
the `retrieveLaunchParams` function. It tries to retrieve them from all possible sources, and if it
fails, an error will be thrown.

```typescript
import { retrieveLaunchParams } from '@telegram-apps/bridge';

const launchParams = retrieveLaunchParams();
```
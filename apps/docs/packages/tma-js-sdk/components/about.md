# About components

All components in this package are supposed to be used as singletons. This means that you should not
create multiple instances of the same component and use them, even if it is not explicitly
forbidden. However, in this case, there is no guarantee that everything will work fine.

The reason for this is that each component stores its state locally, and the instances of the class
are not synchronized with each other. For example, if a developer creates two instances of
the `Popup` component and one of them calls the `open()` method, it will change its `isOpened`
property to `true`. However, the second instance of `Popup` will not be aware of this change and
will still return a `false` value, which is incorrect.

To avoid potential problems, developers can rely on the package's `init` function, which provides
initialized components that are sufficient for use across the application.

## Events

Component instances use the common way of events listening through the `on` and `off` methods.
Here is the example with the `BackButton` component:

```typescript
import { BackButton } from '@tma.js/sdk';

const backButton = new BackButton(...);

backButton.on('click', () => {
  console.log('Back button clicked.');
});
```

You can find the list of supported events in components own documentations.

## Methods Support

Almost each component is capable of checking whether its method is supported by the current Telegram
Mini Apps version or not. To check if some methods are supported, developer should use the component
instance `supports()` function. For example:

```typescript
import { BackButton } from '@tma.js/sdk';

let backButton = new BackButton('6.0', ...);
backButton.supports('show'); // false

backButton = new BackButton('6.3', ...);
backButton.supports('hide'); // true
```

Some of the components support an additional method `supportsParam` which allows checking if
method parameter is supported:

```typescript
import { Utils } from '@tma.js/sdk';

let utils = new Utils('6.0', ...);
utils.supportsParam('openLink.tryInstantView'); // false

backButton = new Utils('6.10', ...);
utils.supportsParam('openLink.tryInstantView'); // true
```

::: tip

It is recommended to use this functionality before calling some component method as long as this
will make developer sure, it will work. The list of supported methods by components is described in
each component documentation.

:::

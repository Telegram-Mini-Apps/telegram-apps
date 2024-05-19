---
outline: [2, 3]
---

# Components

## Init

According to the design of this package, the developer has complete control over its lifecycle,
including the initialization process. This means that there are no pre-initialized global components
available for use by the developer. They must create the components themselves.

To simplify the developer's workflow, the package includes special functions prefixed with
the `init` string. These functions return instances of the initialized components, making it easier
for developers to work with the package.

Here is an example:

```typescript
import { initBackButton, initMainButton } from '@tma.js/sdk';

const mainButton = initMainButton();
const backButton = initBackButton();

// Clicking the MainButton hides it and shows the BackButton.
mainButton.on('click', () => {
  mainButton.hide();
  backButton.show();
});

// Clicking the BackButton hides it and shows the MainButton.
backButton.on('click', () => {
  mainButton.show();
  backButton.hide();
});

// Configure the MainButton.
mainButton
  .setBgColor('#ff0000')
  .setTextColor('#ffffff')
  .setText('Expand')
  .enable()
  .show();
```

:::info

Take note that some components cannot be instantiated synchronously as long as there is no
information about them locally. Use each component's documentation to learn more about how the
component initializes.

:::

## Events

Component instances use the common way of events listening through the `on` and `off` methods.
Here is the example with the `BackButton` component:

```typescript
import { initBackButton } from '@tma.js/sdk';

const backButton = initBackButton();

// Clicking the BackButton hides it and shows the MainButton.
backButton.on('click', () => {
  console.log('BackButton clicked.');
});
```

You can find the list of supported events in components own documentations.

## Methods Support

Almost each component is capable of checking whether its method is supported by the current
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
method <ins>parameter</ins> is supported:

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

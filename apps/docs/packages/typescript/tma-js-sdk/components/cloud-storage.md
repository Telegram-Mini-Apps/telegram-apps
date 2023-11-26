# `CloudStorage`

Implements functionality related to Telegram Mini Apps cloud storage.

## Initialization

Component constructor accepts Telegram Mini Apps version, function to generate request identifiers
for called Telegram Mini Apps methods and optional function to call them.

```typescript
import { CloudStorage, postEvent } from '@tma.js/sdk';

const cloudStorage = new CloudStorage(
  '6.10',
  () => Math.random().toString(),
  postEvent,
);  
```

## Setting items

To save a value in the cloud storage, it is required to use the `set` method:

```typescript
cloudStorage
  .set('my-key', 'my-value')
  .then(() => console.log('Item saved'));
```

## Getting items

To get values by keys, it is required to use `get` method, which acquires both single string
value and array of string values:

::: code-group

```typescript [Single value]
cloudStorage
  .get('my-key')
  .then((value) => {
    console.log(value);
    // Output: 'my-value'
  });

cloudStorage
  .get('non-existent')
  .then((value) => {
    console.log(value);
    // Output: ''
  });
```

```typescript [Array of values]
cloudStorage
  .get(['my-key', 'non-existent'])
  .then((result) => {
    console.log('Result is', result);
    // Output:
    // {
    //   'my-key': 'my-value',
    //   'non-existent': ''
    // }
  });
```

:::

This method returns empty strings for those keys, which don't exist in the cloud storage.

## Getting keys

To retrieve all registered keys in the cloud storage, it is required to use the `getKeys` method:

```typescript
cloudStorage
  .getKeys()
  .then((keys) => {
    // Will be ['my-key'].
    console.log('Keys are', keys);
  })
```

## Deleting items

To delete items in the cloud storage, it is required to use `delete` method. This method allows
deleting both single and multiple items:

::: code-group

```typescript [Single item]
cloudStorage
  .delete('my-key')
  .then(() => console.log('Key was deleted'));
```

```typescript [Multiple items]
cloudStorage
  .delete(['my-key', 'another-key'])
  .then(() => console.log('Keys were deleted'));
```

:::

## Methods support

List of methods, which could be used in `supports` component instance method:

- `delete`
- `get`
- `getKeys`
- `set`

```typescript
import { CloudStorage } from '@tma.js/sdk';

const cloudStorage = new CloudStorage(...);
cloudStorage.supports('delete');
cloudStorage.supports('get');
cloudStorage.supports('getKeys');
cloudStorage.supports('set');
```

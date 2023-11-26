# `Invoice`

Implements Telegram [invoices](https://core.telegram.org/bots/payments#introducing-payments-2-0)
functionality.

## Initialization

Component constructor accepts Telegram Mini Apps version and optional function to call
Telegram Mini Apps methods.

```typescript
import { Invoice, postEvent } from '@tma.js/sdk';

const invoice = new Invoice('6.3', postEvent);
```

## Opening invoice

To open an invoice, it is required to use the `open` method. This method allows opening invoices
using their URLs or slugs.

Opening an invoice in URL mode requires passing the second argument equal to `url`, so the method
will interpret the passed value as a URL.

To interpret the passed value as a slug, omit the second argument.

::: code-group

```typescript [Using slug]
invoice
  .open('abIIks213')
  .then((status) => {
    // Output: 'paid'
    return console.log(status);
  });
```

```typescript [Using URL]
invoice
  .open('https://t.me/invoice/abIIks213', 'url')
  .then((status) => {
    // Output: 'paid'
    return console.log(status);
  });
```

:::

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event           | Listener                   | Triggered when                 |
|-----------------|----------------------------|--------------------------------|
| change          | `() => void`               | Something in component changed |
| change:isOpened | `(value: boolean) => void` | `isOpened` property changed    |

## Methods support

List of methods, which could be used in `supports` component instance method:

- `open`

```typescript
import { Invoice } from '@tma.js/sdk';

const invoice = new Invoice(...);
invoice.supports('open');
```

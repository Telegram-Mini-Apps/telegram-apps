# Invoice

The scope responsible for the
Telegram [invoices](https://core.telegram.org/bots/payments#introducing-payments-2-0).

## Opening

To open an invoice, it is required to use the `open` method. This method allows opening invoices
using their URLs or slugs.

Opening an invoice in URL mode requires passing the second argument equal to `url`, so the method
will interpret the passed value as a URL.

Calling the method updates the `isOpened` signal property value.

::: code-group

```ts [Using object]
import { invoice } from '@telegram-apps/sdk';

// invoice.isOpened() -> false
const promise = invoice.open('abIIks213');
// invoice.isOpened() -> true
const status = await promise;
// invoice.isOpened() -> false

// Or in URL mode:
await invoice.open('https://t.me/invoice/abIIks213', 'url');
```

```ts [Using function]
import { openInvoice, isInvoiceOpened } from '@telegram-apps/sdk';

// isInvoiceOpened() -> false
const promise = openInvoice('abIIks213');
// isInvoiceOpened() -> true
const status = await promise;
// isInvoiceOpened() -> false

// Or in URL mode:
await openInvoice('https://t.me/invoice/abIIks213', 'url');
```

:::

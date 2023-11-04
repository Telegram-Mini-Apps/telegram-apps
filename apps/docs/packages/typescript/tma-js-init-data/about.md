# @tma.js/init-data

[npm-link]: https://npmjs.com/package/@tma.js/init-data

[npm-shield]: https://img.shields.io/npm/v/@tma.js/init-data?logo=npm

![[npm-link]][npm-shield]

The package provides utilities to work with the initialization data of Telegram Mini Apps on the
client side. To learn more about the initialization data and its usage, please refer to
the [documentation](../../../launch-parameters/common-information.md).

## Installation

::: code-group

```bash [pnpm]
pnpm i @tma.js/init-data
```

```bash [npm]
npm i @tma.js/init-data
```

```bash [yarn]
yarn add @tma.js/init-data
```

:::

## Parsing

This library includes the function `parse`, which can extract initialization data information
from query parameters. Here is an example of its usage:

```typescript
import { parse } from '@tma.js/init-data';

// Let's imagine, we have init data in a raw format like this. Telegram application is
// sending it in the exact same format.
const initDataString =
  'query_id=AAHdF6IQAAAAAN0XohDhrOrc' +
  '&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D' +
  '&auth_date=1662771648' +
  '&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2';

// Extract init data.
console.log(parse(initDataString));
// or
console.log(parse(new URLSearchParams(initDataString)));

// Output:
// {
//   authDate: 2022-09-10T01:00:48.000Z,
//   hash: 'c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2',
//   queryId: 'AAHdF6IQAAAAAN0XohDhrOrc',
//   user: {
//     id: 279058397,
//     firstName: 'Vladislav',
//     lastName: 'Kibenko',
//     username: 'vdkfrost',
//     languageCode: 'ru',
//     isPremium: true
//   }
// }
```

The function extracts the required parameters and automatically validates their types. If a property
has an invalid type or value, it will throw an error. To learn more about returned type, refer
to [InitData type](init-data.md) page.

## Validation

We have moved the validation utilities to a
separate [TypeScript package](../tma-js-init-data-node.md). These utilities are only needed on the
server side, as there is no need to validate initialization data on the client side.**

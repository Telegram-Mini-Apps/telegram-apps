# @tma.js/init-data-node

[npm-link]: https://npmjs.com/package/@tma.js/init-data-node

[npm-shield]: https://img.shields.io/npm/v/@tma.js/init-data-node?logo=npm

![[npm-link]][npm-shield]

The package provides utilities to work with the initialization data of Telegram Mini Apps on the
server side. To learn more about the initialization data and its usage, please refer to
the [documentation](../../platform/launch-parameters/common-information.md).

## Installation

::: code-group
```bash [pnpm]
pnpm i @tma.js/init-data-node
```

```bash [npm]
npm i @tma.js/init-data-node
```

```bash [yarn]
yarn add @tma.js/init-data-node
```
:::

## Parsing

You can learn more about parsing utilities in [@tma.js/sdk](../typescript/tma-js-sdk/init-data/about#parsing)
documentation.

## Validation

To validate the signature of the initialization data, the `validate` function is used. It expects
the initialization data to be passed in raw format (search parameters) and throws an error in
certain cases.

```typescript
import { validate } from '@tma.js/init-data-node';

const secretToken = '5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8';
const initData =
  'query_id=AAHdF6IQAAAAAN0XohDhrOrc' +
  '&user=%7B%22id%22%3A279058397%2C%22first_name%22%3A%22Vladislav%22%2C%22last_name%22%3A%22Kibenko%22%2C%22username%22%3A%22vdkfrost%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%7D' +
  '&auth_date=1662771648' +
  '&hash=c501b71e775f74ce10e377dea85a7ea24ecd640b223ea86dfe453e0eaed2e2b2';

validate(initData, secretToken);
```

Function will throw an error in one of these cases:

- `auth_date` should present integer
- `auth_date` is empty or not found
- `hash` is empty or not found
- Signature is invalid
- Init data expired

By default, the function checks the expiration of the initialization data. The default expiration
duration is set to 1 day (86,400 seconds). It is recommended to always check the expiration of the
initialization data, as it could be stolen but still remain valid. To disable this feature,
pass `{ expiresIn: 0 }` as the third argument.

# Non-throwing functions

This package provides alternatives to many functions that are not throwing any errors, but
returning them. We recommend using such package as [fp-ts](https://npmjs.com/package/fp-ts) to
process such kind of results.

Here are some examples:

```typescript
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { postEventFp, retrieveLaunchParamsFp } from '@tma.js/bridge';

pipe(
  postEventFp('web_app_expand'),
  O.match(
    () => {
      // Everything is ok.
    },
    error => {
      // error will be typed here, you will know exactly what is wrong.
    },
  ),
);

pipe(
  retrieveLaunchParamsFp(),
  E.match(
    error => {
      // ...
    },
    launchParams => {
      // ...
    },
  ),
);
```
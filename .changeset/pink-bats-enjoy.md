---
"@telegram-apps/bridge": major
---

- Remove `subscribe`, `unsubscribe`, `defineEventHandlers`, `$debug`, `$targetOrigin` variables.
- Allow listening to all events via `on('*', listener)`
- Set debug mode via `setDebug`
- Simplify `retrieveLaunchParams` and return a reworked `LaunchParams` type
- By default `isTMA` know uses simple way via retrieving launch params. `simple` argument was replaced with `complete`
- Add `valibot`, `better-promises`, `mitt` and `error-kid` as dependencies

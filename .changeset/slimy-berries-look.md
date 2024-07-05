---
"@tma.js/sdk": minor
---

- Remove Mini Apps events parsers we don't really need now.
- Make `createPostEvent` result function not check some safe Mini Apps methods parameters.
- Rework the `request` function and fix a bug related to incorrect multiple events handling.
- Add `MiniApp.close` `returnBack` argument.
- Fix invalid URL in generation in `Utils.shareURL`
- Add `Utils.openLink` `tryBrowser` parameter.

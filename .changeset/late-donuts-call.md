---
"@tma.js/navigation": patch
---

Divide `Navigator` into 2 separate:

1. `BasicNavigator` which encapsulates logic related to any type of navigation.
2. `HashNavigator` which is based on `BasicNavigator` and allows client routing via `window.location.history` and location hash.

This engagement allows developers to implement some other routers. For example, it allows creating `MemoryNavigator` or bind to the Next router.

---
"@tma.js/sdk": minor
---

Make components initializer works only on the client side. Previously, we had a logic related to SSR, but it was moved to the external packages. In this update also make BrowserNavigator hash mode equal to "classic" by default.

---
"@tma.js/event-emitter": minor
---

Improve `emit` method code. Return remove event listener function from `on` and `once` methods. Do the same with `subscribe` method. `off` and `unsubscribe` methods now remove only 1 listener, not all its instances.

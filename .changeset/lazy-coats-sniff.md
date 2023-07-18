---
"@twa.js/bridge": patch
---

Fix bug related to ios and macOS environment detection. We are now looking at window.TelegramWebviewProxy.postEvent function to send an event.

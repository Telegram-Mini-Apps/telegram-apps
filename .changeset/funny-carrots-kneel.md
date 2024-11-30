---
"@telegram-apps/bridge": minor
---

Remove `viewport_changed` event generation on window resize as it is currently supported by the most of Telegram applications.

Implement `fullscreen_changed`, `fullscreen_failed`, `web_app_request_fullscreen` and `web_app_exit_fullscreen` events and methods.

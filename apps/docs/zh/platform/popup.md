# Popup

![Popup](/components/popup.png)

Popup is a component that is located on top of the Mini App. Its classic use case is a request for
user confirmation to perform an action. Telegram Mini Apps allows specifying popup title, message
and the list of up to 3 configurable buttons.

To show the popup, developer can utilize
the [web_app_open_popup](methods.md#web-app-open-popup) Telegram Mini Apps
method. When user presses any popup button, Telegram application emits
the [popup_closed](events.md#popup-closed) event passing the identifier of the
clicked button.

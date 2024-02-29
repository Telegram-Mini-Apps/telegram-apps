# Back Button

![Back Button](/components/back-button.png)

The main task that the Back Button performs is to provide a seemingly native way to navigate back in
the routing history. However, Telegram does not restrict the developer in the ways of using the Back
Button and allows them to handle the component click event as required in the application.

When working with this component, it is important to understand that, like other Telegram Mini Apps
components, clicking it does not inherently trigger any built-in action. Its handling is the
responsibility of the developer.

To show the Back Button, it is required to
call [web_app_setup_back_button](methods.md#web-app-setup-back-button)
method. When user clicks this component, Telegram application
emits [back_button_pressed](events.md#back-button-pressed) event.


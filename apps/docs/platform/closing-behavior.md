# Closing Behavior

![Closing confirmation](/functionality/closing-confirmation.png)

Mini Apps are intended to handle different, and at times, complex scenarios where the user can
navigate deep into the application architecture. It's a common situation when a user is following a
specific workflow, such as purchasing an airplane ticket, which involves multiple steps.

Accidentally closing a Mini App with data loss can be a significant disappointment for the user. To
prevent this, developers have the option to configure the closing behavior and prompt the user
before closing the application.

To enable closing confirmation, Telegram Mini Apps provides a method
called [web_app_setup_closing_behavior](methods.md#web-app-setup-closing-behavior).

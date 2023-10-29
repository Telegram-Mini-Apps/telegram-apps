[//]: # (FIXME: This page needs better screenshots of components. Current are horrible.)

# Main Button

The Main Button is a component that is usually used when it is necessary to perform some final
action.

An example of the use case of this component is sending data. For example, a Mini App may
involve selecting products from a catalog and filling a user's shopping cart. At the moment when
products appear in the cart, the developer can display the Main Button, clicking on which will cause
the creation and processing of the order.

<img
  src="/components/main-button.png"
  alt="Main Button"
  width="300"
/>

This is a fairly large and at the same time simple component that provides narrow functionality. The
developer has the ability to control the following properties of the Main Button:

- Text
- Text color
- Background color
- Visibility
- Loader visibility
- Activity state

::: tip

If clicking on the button produces an action that takes some time to complete, it is recommended to
display the loader inside the Main Button. This will allow the user to understand that the
application is not frozen and is currently performing an operation.

:::

- [Related method](../apps-communication/methods.md#web-app-setup-main-button)
- [Button click generated event](../apps-communication/events.md#main-button-pressed)
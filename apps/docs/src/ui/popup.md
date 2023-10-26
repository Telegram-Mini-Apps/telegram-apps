[//]: # (FIXME: This page needs better screenshots of components. Current are horrible.)

# Popup

Popup is a component that is located on top of the TWA application. Its
classic use case is a request for user confirmation to perform an action.

The developer is allowed to specify a title, message and a list of buttons,
which should be displayed inside to popup.

Speaking of buttons, it is important to note that each of them
is also customizable. Among the fields available for modification are the
following:

- ID
- Text
- Type. Defines the color scheme of the button, and also provides the ability to specify localized
  text for typical cases

<img
  src="/components/popup.png"
  alt="Main Button"
  width="300"
/>

- [Related method](../apps-communication/methods#web-app-open-popup)
- [Popup closed generated event](../apps-communication/events#popup-closed)
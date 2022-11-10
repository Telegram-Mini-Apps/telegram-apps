# Popup

Controls currently displayed application popup. It allows developers to open new
custom popups and detect popup-connected events.

## Usage

To create new instance of `Popup`, we need current Web App version
and optional `Bridge` instance.








## Props

#### `isOpened: boolean`

Shows whether popup is currently opened.

## Methods

#### <code>show(params: [PopupParams](types.ts#L5)): Promise<string | null></code>

**Web App version**: `6.2+`

A method that shows a native popup described by the `params` argument. Promise
will be resolved when popup is closed. Resolved value will have an identifier of
pressed button.

In case, user clicked outside the popup or clicked top right popup close
button, `null` will be returned.

#### `showAlert(message: string): Promise<void>`

**Web App version**: `6.2+`

A method that shows message in a simple alert with a `Close` button. Promise
will be resolved when popup is closed.

#### `showConfirm(message: string): Promise<boolean>`

**Web App version**: `6.2+`

A method that shows message in a simple confirmation window with `OK`
and `Cancel` buttons. Promise will be resolved when popup is closed. Resolved
value will be `true` in case, user pressed `OK` button. The result will
be `false` otherwise.
# `WebApp`

Provides functionality which is recognized as common for Web Apps. In other
words, this class contains mostly utilities.

## Props

#### `backgroundColor: RGBColor | undefined`

Current native application background color.

#### <code>colorScheme: [ColorScheme](types.ts)</code>

Current application color scheme. This value is computed according
to current background color.

#### <code>headerColor: [SettableColorKey](types.ts)</code>

Current native application header color key.

#### `isClosingConfirmationEnabled: boolean`

`true`, if the confirmation dialog enabled while the user is trying to close the
Web App.

#### `version: string`

Current Web App version. This property is used by other components to check if
some functionality is available on current device.

## Methods

#### `close(): void`

Closes the Web App.

#### `disableClosingConfirmation(): void`

**Web App version**: `6.1+`

Disables the confirmation dialog while the user is trying to close the Web App.

#### `enableClosingConfirmation(): void`

**Web App version**: `6.1+`

Enables the confirmation dialog while the user is trying to close the Web App.

#### `isVersionAtLeast(version: string): boolean`

Return `true` in case, passed version is more than or equal to current Web App
version.

#### `openLink(url: string): void`

Opens a link in an external browser. The Web App will not be closed.

Note that this method can be called only in response to the user interaction
with the Web App interface (e.g. click inside the Web App or on the main button)
.

#### `openTelegramLink(url: string): void`

**Web App version**: `6.1+`

Opens a telegram link inside Telegram app. The Web App will be closed.

#### `openInvoice(url: string): void`

**Web App version**: `6.1+`

Opens an invoice using the link url.

#### `ready(): void`

Informs the Telegram app that the Web App is ready to be displayed.

It is recommended to call this method as early as possible, as soon as all
essential interface elements loaded. Once this method called, the loading
placeholder is hidden and the Web App shown.

If the method not called, the placeholder will be hidden only when the page
fully loaded.

#### `sendData(data: string): void`

Sends data to the bot. When this method called, a service message sent to the
bot containing the data of the length up to 4096 bytes, and the Web App closed.
See the field `web_app_data` in the class Message.

This method is only available for Web Apps launched via a Keyboard button.

#### `setBackgroundColor(color: RGBColor): void`

**Web App version**: `6.1+`

Updates current application background color.

#### <code>setHeaderColor(color: [SettableColorKey](/src/components/WebApp/types.ts)): void</code>

**Web App version**: `6.1+` 

Updates current application header color.
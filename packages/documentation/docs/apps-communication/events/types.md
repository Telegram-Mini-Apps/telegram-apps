---
sidebar_position: 2
---

# Types

This documentation contains list of events, sent from Telegram: their names,
description and parameters. Section title means minimal version, from which
events inside section could be sent.

## `v6.0`

### `invoice_closed`

Invoice closed. Event contains passed
during [`web_app_open_invoice`](../methods/types#web_app_open_invoice) method
invocation `slug` and invoice status.

```typescript
type Payload = {
  slug: string;
  status: 'paid' | 'failed' | 'pending' | 'cancelled';
}
```

### `main_button_pressed`

User clicked main button.

*No payload.*

### `popup_closed`

Popup was closed. Payload will contain `button_id` property which is identifier
of clicked button. In case, no button was clicked, payload will be empty
object (`{}`).

```typescript
type Payload = {button_id?: string}
```

### `set_custom_style`

Event, which is usually sent from Telegram web version. Its payload represents
`<style/>` tag html content, developer could use. Stylesheet described in
payload will help developer to stylize app scrollbar (but he is still able to do
it himself).

```typescript
type Payload = string;
```

### `theme_changed`

Occurs whenever theme settings changed in the user's Telegram app
(including switching to night mode). `theme_params` property is object with
key-value pairs, where key is some key name (`bg_color`, `secondary_bg_color`,
...), and value is its color in `#RRGGBB` format.

```typescript
type Payload = {theme_params: Record<string, string>};
```

### `viewport_changed`

Occurs whenever viewport has been changed. For example, when user started
dragging application popup, or called expansion method.

Pay attention to fact, that send rate of this method is not enough to smoothly
resize application window. You should probably use stable height instead of
current one, or handle this problem in other way.

```typescript
type Payload = {
  height: number;
  width?: number;
  is_expanded: boolean;
  // Will be true in case, viewport changes stopped, and passed height
  // could be saved as latest stable.
  is_state_stable: boolean;
};
```

## `v6.1`

### `back_button_pressed`

User clicked back button.

*No payload.*

### `settings_button_pressed`

Occurs when the `Settings` item in context menu was pressed. Not all
applications have this button.

*No payload.*
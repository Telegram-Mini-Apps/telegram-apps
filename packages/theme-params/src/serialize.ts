import type { ThemeParams } from './types.js';

/**
 * Converts theme params to its initial representation.
 * @param value - theme parameters.
 */
export function serialize(value: ThemeParams): string {
  const {
    linkColor,
    secondaryBackgroundColor,
    hintColor,
    textColor,
    buttonTextColor,
    buttonColor,
    backgroundColor,
  } = value;

  return JSON.stringify({
    bg_color: backgroundColor,
    button_color: buttonColor,
    button_text_color: buttonTextColor,
    hint_color: hintColor,
    link_color: linkColor,
    secondary_bg_color: secondaryBackgroundColor,
    text_color: textColor,
  });
}

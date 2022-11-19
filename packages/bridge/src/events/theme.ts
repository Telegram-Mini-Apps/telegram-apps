/**
 * @see https://corefork.telegram.org/api/bots/webapps#theme-changed
 */
export interface ThemeChangedPayload {
  theme_params: Record<string, unknown>;
}
/**
 * @see https://corefork.telegram.org/api/bots/webapps#viewport-changed
 */
export interface ViewportChangedPayload {
  height: number;
  width: number;
  is_expanded: boolean;
  is_state_stable: boolean;
}
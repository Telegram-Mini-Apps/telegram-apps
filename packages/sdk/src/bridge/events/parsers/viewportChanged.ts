import { boolean, json, number } from '../../../parsing/index.js';

export interface ViewportChangedPayload {
  /**
   * The viewport height.
   */
  height: number;
  /**
   * The viewport width.
   */
  width: number;
  /**
   * Is the viewport currently expanded.
   */
  is_expanded: boolean;
  /**
   * Is the viewport current state stable and not going to change in the next moment.
   */
  is_state_stable: boolean;
}

export function viewportChanged() {
  return json<ViewportChangedPayload>({
    height: number(),
    width: (value) => (
      value === null || value === undefined
        ? window.innerWidth
        : number().parse(value)
    ),
    is_state_stable: boolean(),
    is_expanded: boolean(),
  });
}

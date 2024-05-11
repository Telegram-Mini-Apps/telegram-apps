import { WithStateUtils } from '@/classes/WithStateUtils.js';
import type { StateEvents } from '@/classes/State/types.js';
import type { EventEmitter } from '@/events/event-emitter/EventEmitter.js';

type Emitter<StateShape extends object> = EventEmitter<StateEvents<StateShape>>;

export class WithTrackableState<StateShape extends object>
  extends WithStateUtils<StateShape> {
  /**
   * Adds a new event listener.
   */
  on: Emitter<StateShape>['on'] = this.state.on.bind(this.state);

  /**
   * Removes the event listener.
   */
  off: Emitter<StateShape>['off'] = this.state.off.bind(this.state);
}

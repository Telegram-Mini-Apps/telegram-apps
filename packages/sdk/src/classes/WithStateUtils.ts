import { State } from '@/classes/State/State.js';

export class WithStateUtils<Shape extends object> {
  protected state: State<Shape>;

  constructor(shape: Shape) {
    this.state = new State(shape);
    this.set = this.state.set.bind(this.state);
    this.get = this.state.get.bind(this.state);
    this.clone = this.state.clone.bind(this.state);
  }

  /**
   * Gets the state value.
   */
  protected get: State<Shape>['get'];

  /**
   * Sets the state value.
   */
  protected set: State<Shape>['set'];

  /**
   * Clones the current state.
   */
  protected clone: State<Shape>['clone'];
}

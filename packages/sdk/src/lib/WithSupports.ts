import { Version } from '@twa.js/utils';
import { type MethodName, supports } from '@twa.js/bridge';

export class WithSupports<S extends string> {
  readonly #version: Version;

  readonly #schema: Record<S, MethodName>;

  constructor(version: Version, schema: Record<S, MethodName>) {
    this.#version = version;
    this.#schema = schema;
  }

  /**
   * Returns true in case, specified method is supported
   * by current component.
   * @param method - component method name.
   */
  supports(method: S): boolean {
    return supports(this.#schema[method], this.#version);
  }
}

import { createSingleton } from '@/misc/createSingleton.js';

import { createEmitter, type Emitter } from './createEmitter.js';

const [getSingletonEmitter, disposeSingletonEmitter] = createSingleton(
  createEmitter,
  (result) => result[1](),
);

export { disposeSingletonEmitter };

// TODO: Return type?
export function singletonEmitter(): Emitter {
  return getSingletonEmitter()[0];
}

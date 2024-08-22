import { ERR_UNEXPECTED_TYPE } from './errors.js';
import { TransformerError } from './TransformerError.js';

export function throwUnexpectedValue(value: unknown): never {
  throw new TransformerError(ERR_UNEXPECTED_TYPE, `Unexpected value received: ${JSON.stringify(value)}`);
}
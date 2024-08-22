import { createTypedError } from '@telegram-apps/toolkit';

import type { ErrorType } from './errors.js';

export const TransformerError = createTypedError<ErrorType>('TransformerError');
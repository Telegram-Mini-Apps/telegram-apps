import { createTypedError } from '@telegram-apps/toolkit';

import type { ErrorType } from './errors.js';

export const SDKError = createTypedError<ErrorType>('SDKError');
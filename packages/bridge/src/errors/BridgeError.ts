import { createTypedError } from '@telegram-apps/toolkit';

import type { ErrorType } from '@/errors/errors.js';

export const BridgeError = createTypedError<ErrorType>('BridgeError');

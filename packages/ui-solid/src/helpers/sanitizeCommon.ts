import { createSanitizer } from '~/helpers/createSanitizer.js';

/**
 * Removes properties `colorScheme`, `classes` and `platform` along with additionally passed.
 */
export const sanitizeCommon = createSanitizer(['colorScheme', 'classes', 'platform']);


import { createOn } from './createOn.js';
import { themeChanged } from '../parsers/themeChanged.js';

/**
 * Adds new event listener to the "theme_changed" event.
 */
export const onThemeChanged = createOn('theme_changed', themeChanged);

import { createOn } from './createOn.js';
import { viewportChanged } from '../parsers/viewportChanged.js';

/**
 * Adds new event listener to the "viewport_changed" event.
 */
export const onViewportChanged = createOn('viewport_changed', viewportChanged);

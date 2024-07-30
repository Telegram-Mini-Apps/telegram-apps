import { computed } from '@/signals/computed/computed.js';
import { isColorDark } from '@/colors/isColorDark.js';

import * as _ from './miniApp.private.js';

/**
 * The Mini App background color.
 * @example "#ffaabb"
 */
export const backgroundColor = computed(_.backgroundColor);

/**
 * The Mini App header color.
 * @example "#ffaabb"
 * @example "bg_color"
 */
export const headerColor = computed(_.headerColor);

/**
 * True if the current Mini App background color is recognized as dark.
 */
export const isDark = computed(() => isColorDark(_.backgroundColor()));

/**
 * True if the component is currently mounted.
 */
export const isMounted = computed(_.isMounted);
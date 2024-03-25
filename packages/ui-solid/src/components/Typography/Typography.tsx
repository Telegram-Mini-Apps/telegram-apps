import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { TypographyCore } from './TypographyCore.js';
import type { TypographyCustomProps, TypographyProps } from './Typography.types.js';

export interface TypographyComponent extends WithConfigComponent<TypographyProps> {
  Custom: WithConfigComponent<TypographyCustomProps>;
}

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = TypographyCore as TypographyComponent;

Typography.Custom = TypographyCore as WithConfigComponent<TypographyCustomProps>;

import { TypographyCore } from './TypographyCore.js';
import type { CreateTypographyProps, TypographyComponent } from './Typography.types.js';

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = new Proxy(TypographyCore, {
  get(_, property: string): any {
    return property === 'Custom'
      ? TypographyCore
      : (props: CreateTypographyProps<any>) => (
        <TypographyCore {...props} component={property}/>
      );
  },
}) as TypographyComponent;

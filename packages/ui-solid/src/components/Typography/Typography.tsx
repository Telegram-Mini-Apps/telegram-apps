import { Dynamic } from 'solid-js/web';
import type { JSXElement } from 'solid-js';

import { mergeWithConfig } from '~/helpers/mergeWithConfig.js';
import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import type { JSXIntrinsicElement } from '~/types/jsx.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';
import type { WithOptionalClasses } from '~/styles/types.js';

import type {
  TypographyElementKey,
  TypographyIntrinsicProps,
  TypographyProps,
} from './Typography.types.js';

import './Typography.scss';

const block = new BemBlockClassNames('tgui-typography');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = styled((
  props:
    & Omit<
      | TypographyIntrinsicProps<any>
      | TypographyProps,
      'classes'
    >
    & WithOptionalClasses<TypographyElementKey, TypographyIntrinsicProps<any> | TypographyProps>,
) => {
  const merged = mergeWithConfig({
    variant: 'text',
    weight: 'regular',
    monospace: false,
    component: 'p',
  } as const, props);

  return (
    <Dynamic
      {...sanitizeCommon(merged, ['variant', 'weight', 'monospace'])}
      class={createClasses(merged)().root}
    />
  );
}, {
  root: (props) => block.calc({
    mix: props.class,
    mods: [
      props.weight,
      props.variant,
      props.platform,
      `${props.platform}-${props.variant}`,
      props.monospace && `${props.platform}-monospace`,
    ],
  }),
}) as {
  <Element extends JSXIntrinsicElement>(
    props: TypographyIntrinsicProps<Element>,
  ): JSXElement;
  (props: TypographyProps): JSXElement;
};

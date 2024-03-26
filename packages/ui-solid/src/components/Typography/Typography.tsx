import { mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import type { Component, JSXElement } from 'solid-js';

import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { JSXIntrinsicElement } from '~/types/jsx.js';
import type { WithPartialConfig } from '~/types/known.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type {
  TypographyDefaults,
  TypographyIntrinsicProps,
  TypographyProps,
} from './Typography.types.js';

import './Typography.scss';

const block = new BemBlockClassNames('tgui-typography');

export interface TypographyComponent extends Component<WithPartialConfig<TypographyProps>> {
  <Element extends JSXIntrinsicElement>(
    props: WithPartialConfig<TypographyIntrinsicProps<Element>>,
  ): JSXElement;
}

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography: TypographyComponent = withConfig(
  styled((props: TypographyIntrinsicProps<any>) => {
    const merged = mergeProps({
      variant: 'text',
      weight: 'regular',
      monospace: false,
      component: 'p',
    } satisfies Required<TypographyDefaults>, props);

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
  }),
);

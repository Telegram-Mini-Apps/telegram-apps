import { mergeProps, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { sanitizeConfig } from '~/helpers/sanitizeConfig.js';
import { withConfig } from '~/hocs/withConfig.js';
import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';

import type { TypographyChildrenProps, TypographyProps } from './Typography.types.js';

import './Typography.scss';

const block = new BemBlockClassNames('tgui-typography');

/**
 * Component used for any typography-related functionality.
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-Library?type=design&node-id=216-1907&mode=design&t=nUrQwsUgG6ktNuOf-0
 */
export const Typography = withConfig(
  styled((props: TypographyProps) => {
    const merged = mergeProps({
      variant: 'text',
      weight: 'regular',
      monospace: false,
    } as const, props);
    const classes = createClasses(merged);

    // Compute dynamic component.
    const component = createMemo(() => {
      return typeof merged.children === 'function' ? merged.children : 'p';
    });

    // Compute dynamic component properties.
    const componentProps = createMemo<
      Omit<TypographyChildrenProps | JSXIntrinsicElementAttrs<'p'>, 'class'>
    >(() => {
      return typeof component() === 'function'
        // Custom component function was passed. In this case, we should pick specific properties
        // and pass them to the custom component.
        ? {}
        // Otherwise, we are rendering 'p' tag and should just sanitize properties.
        : mergeProps(sanitizeConfig(merged, ['variant', 'weight', 'monospace']));
    });

    return (
      <Dynamic
        {...componentProps()}
        component={component()}
        class={classes().root}
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

import { createMemo, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { JSXIntrinsicElementAttrs } from '~/types/jsx.js';
import type { PartialBy } from '~/types/utils.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';
import type { WithOptionalClasses } from '~/styles/types.js';

import type {
  TypographyComponentProps,
  TypographyCustomProps,
  TypographyElementKey,
  TypographyProps,
} from './Typography.types.js';

import './Typography.scss';

const block = new BemBlockClassNames('tgui-typography');

/**
 * Component which implements both custom and common versions of Typography.
 */
export const TypographyCore = withConfig(
  styled((
    props:
      & PartialBy<Omit<TypographyProps & TypographyCustomProps, 'classes'>, 'component'>
      & WithOptionalClasses<TypographyElementKey, TypographyProps | TypographyCustomProps>,
  ) => {
    const merged = mergeProps({
      variant: 'text',
      weight: 'regular',
      monospace: false,
    } as const, props);
    const classes = createClasses(merged);
    const component = createMemo(() => merged.component || 'p');
    const computedProps = createMemo<
      Omit<TypographyComponentProps | JSXIntrinsicElementAttrs<'p'>, 'class'>
    >(() => {
      const keys = ['variant', 'weight', 'monospace'] as const;

      return sanitizeCommon(
        merged,
        typeof component() === 'function'
          // Custom component function was passed. In this case, we should pick the
          // specific properties and pass them to the custom component.
          ? [...keys, 'component']
          // Otherwise, we are rendering 'p' tag and should just sanitize properties.
          : keys,
      );
    });

    return <Dynamic {...computedProps()} component={component()} class={classes().root}/>;
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

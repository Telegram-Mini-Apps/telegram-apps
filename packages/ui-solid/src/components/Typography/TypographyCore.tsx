import { mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { PartialBy } from '~/types/utils.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';
import type { WithOptionalClasses } from '~/styles/types.js';

import type {
  TypographyCustomProps,
  TypographyDefaults,
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
    } satisfies Required<TypographyDefaults>, props);

    return (
      <Dynamic
        {...sanitizeCommon(merged, ['variant', 'weight', 'monospace'])}
        component={merged.component || 'p'}
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

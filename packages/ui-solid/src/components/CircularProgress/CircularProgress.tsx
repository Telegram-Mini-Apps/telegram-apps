import { isRecord } from '@tma.js/sdk';
import { createMemo, mergeProps } from 'solid-js';

import { sanitizeCommon } from '~/helpers/sanitizeCommon.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { CircularProgressProps } from './CircularProgress.types.js';

import './CircularProgress.scss';

const block = new BemBlockClassNames('tgui-circular-progress');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-·%C2%A0UI-Kit?type=design&node-id=216-2847&mode=design&t=T40lNBs6ULRFVHOS-0
 */
export const CircularProgress: WithConfigComponent<CircularProgressProps> = withConfig(
  styled((props: CircularProgressProps) => {
    const merged = createMemo(() => {
      const max = !props.max || props.max <= 0 ? 1 : props.max;

      return mergeProps({ size: 'md' } as const, props, {
        max,
        value: Math.min(max, Math.max(0, props.value || 0)),
      });
    });
    const classes = createClasses(merged);

    const style = () => {
      const propsStyle = merged().style || '';
      const perimeter = Math.PI * 2;

      return `${isRecord(propsStyle)
        ? Object
          .entries(propsStyle)
          .map(([cssRule, value]) => `${cssRule}:${value}`)
          .join(';')
        : propsStyle
      };--value:${perimeter * (merged().value / merged().max)};--max:${perimeter}`;
    };

    return (
      <svg
        {...sanitizeCommon(merged(), ['size', 'max', 'value'])}
        class={classes().root}
        style={style()}
      >
        <circle class={classes().background} cx="50%" cy="50%" r="50%"/>
        <circle class={classes().fill} cx="50%" cy="50%" r="50%"/>
      </svg>
    );
  }, {
    root: (props) => block.calc({
      mix: props.class,
      mods: props.size,
    }),
    background: block.elem('background').calc(),
    fill: block.elem('fill').calc(),
  }),
);

import { mergeProps } from 'solid-js';

import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import { Button } from '~/components/Button/Button.js';
import type {
  IconButtonDefaults,
  IconButtonProps,
} from '~/components/IconButton/IconButton.types.js';

import './IconButton.scss';

const block = new BemBlockClassNames('tgui-icon-button');

/**
 * Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-·%C2%A0UI-Kit?type=design&node-id=442-15161&mode=design&t=m05h6QLGMZhDICKu-0
 */
export const IconButton: WithConfigComponent<IconButtonProps> = withConfig(
  styled((props: IconButtonProps) => {
    const merged = mergeProps({
      rounded: false,
      size: 'md',
      variant: 'bezeled',
      disabled: false,
    } satisfies Required<IconButtonDefaults>, props);

    return (
      <Button
        {...sanitizeProps(merged, ['children'])}
        classes={createClasses(merged)()}
        icon={merged.children}
      />
    );
  }, {
    root: (props) => block.calc({
      mods: [
        props.size,
        !props.rounded && 'default',
      ],
    }),
    icon: block.elem('icon').calc(),
    iconContainer: (props) => block.elem('icon-container').calc({
      mods: props.size,
    }),
  }),
);

import { mergeWithConfigDefaults } from '~/components/utils.js';
import { sanitizeProps } from '~/helpers/sanitizeProps.js';
import { withConfig } from '~/hocs/withConfig.js';
import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import type { ProgressProps } from './Progress.types.js';

import './Progress.scss';

const block = new BemBlockClassNames('tgui-progress');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-·%C2%A0UI-Kit?type=design&node-id=216-2847&mode=design&t=T40lNBs6ULRFVHOS-0
 */
export const Progress = withConfig(
  styled((props: ProgressProps) => {
    const merged = mergeWithConfigDefaults(props);

    return (
      <progress
        {...sanitizeProps(merged, 'platform', 'colorScheme', 'classes')}
        class={createClasses(merged)().root}
      />
    );
  }, {
    root: (props) => block.calc({
      mix: props.class,
      mods: props.platform,
    }),
  }),
);

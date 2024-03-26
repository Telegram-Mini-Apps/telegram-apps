import { withConfig } from '~/hocs/withConfig.js';
import type { WithConfigComponent } from '~/hocs/withConfig.js';

import { BemBlockClassNames } from '~/styles/bem/BemBlockClassNames.js';
import { createClasses } from '~/styles/createClasses.js';
import { styled } from '~/styles/styled.js';

import { Typography } from '~/components/Typography/Typography.js';

import { Quote12 } from '~/icons/Quote12.js';

import type { QuoteProps } from './Quote.types.js';

import './Quote.scss';

const block = new BemBlockClassNames('tgui-quote');

/**
 * @see Figma: https://www.figma.com/file/AwAi6qE11mQllHa1sOROYp/Telegram-Mini-Apps-·%C2%A0UI-Kit?type=design&node-id=151-1301&mode=design&t=m05h6QLGMZhDICKu-0
 */
export const Quote: WithConfigComponent<QuoteProps> = withConfig(
  styled((props: QuoteProps) => {
    const classes = createClasses(props);

    return (
      <Typography component="blockquote" variant="subheadline2" class={classes().root}>
        {props.children}
        <Quote12 class={classes().icon}/>
      </Typography>
    );
  }, {
    root: (props) => block.calc({ mix: props.class }),
    icon: block.elem('icon').calc(),
  }),
);

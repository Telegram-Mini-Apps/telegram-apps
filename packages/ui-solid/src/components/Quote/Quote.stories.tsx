import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Quote } from './Quote.js';

type StoryComponent = typeof Quote;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Quote',
  component: Quote,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: Quote,
  args: {
    children: 'There is grandeur in this view of life, with its several powers, having been originally breathed by the Creator into a few forms or into one; and that, whilst this planet has gone circling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being evolved.',
  },
  argTypes: {
    children: {
      description: 'Quote content.',
      control: 'text',
    },
    classes: getClassesArgType('root'),
  },
};

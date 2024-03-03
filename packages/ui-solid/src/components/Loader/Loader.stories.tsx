import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Loader as Component } from './Loader.js';
import type { LoaderSize } from './Loader.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Loader',
  component: Component,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      description: 'Loader size',
      options: ['sm', 'md', 'lg'] as LoaderSize[],
      type: {
        name: 'enum',
        value: ['sm', 'md', 'lg'] as LoaderSize[],
        required: false,
      },
      defaultValue: {
        summary: 'md',
      },
      control: {
        type: 'inline-radio',
        labels: {
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
        },
      },
    },
    classes: getClassesArgType({
      elementKeys: ['root', 'inner'],
      component: 'loader',
    }),
  },
};

export default meta;

export const Loader: Story = {
  render: Component,
};

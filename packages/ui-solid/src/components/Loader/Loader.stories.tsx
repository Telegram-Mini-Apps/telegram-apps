import type { Meta, StoryObj } from 'storybook-solidjs';

import { Loader as Component } from './Loader.js';
import type { LoaderSize } from './Loader.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Example/Loader',
  component: Component,
  argTypes: {
    size: {
      name: 'Size',
      description: 'Loader size',
      options: ['sm', 'md', 'lg'] as LoaderSize[],
      defaultValue: 'md',
      control: {
        type: 'inline-radio',
        labels: {
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
        },
      },
    },
  },
};

export default meta;

export const Loader: Story = {
  render: Component,
};

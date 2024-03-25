import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { CircularProgress } from './CircularProgress.js';
import type { CircularProgressSize } from './CircularProgress.types.js';

type StoryComponent = typeof CircularProgress;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
};

export default meta;

const sizes: CircularProgressSize[] = ['sm', 'md', 'lg'];

export const Playground: Story = {
  render: CircularProgress,
  args: {
    size: 'md',
    value: 0.33,
  },
  argTypes: {
    value: {
      description: 'Current progress value.',
      control: 'number',
      defaultValue: { summary: 0 },
    },
    max: {
      description: 'Maximum progress value.',
      control: 'number',
      defaultValue: { summary: 1 },
    },
    size: {
      description: 'Component size.',
      options: sizes,
      defaultValue: { summary: 'md' },
      control: {
        type: 'inline-radio',
        labels: {
          sm: 'Small (sm)',
          md: 'Medium (md)',
          lg: 'Large (lg)',
        },
      },
    },
    classes: getClassesArgType('root', 'background', 'fill'),
  },
};

export const Preview: Story = {
  render: () => (
    <div style={{ display: 'flex', 'align-items': 'flex-start', gap: '20px' }}>
      <For each={sizes}>
        {(size, index) => (
          <CircularProgress size={size} value={(index() + 1) * 0.25 + 0.25 * Math.random()}/>
        )}
      </For>
    </div>
  ),
};

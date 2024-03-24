import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';
import { Progress } from './Progress.js';

type StoryComponent = typeof Progress;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Progress',
  component: Progress,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: Progress,
  args: {
    value: 0.6,
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
    classes: getClassesArgType('root'),
  },
};

export const Preview: Story = {
  render: () => (
    <For each={Array.from({ length: 5 }, (_, idx) => (idx + 1) * 20)}>
      {(value) => (
        <div style={{ 'margin-bottom': '24px' }}>
          <Progress value={value} max={100}/>
        </div>
      )}
    </For>
  ),
};

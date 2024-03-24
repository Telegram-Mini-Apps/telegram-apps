import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';
import { Badge } from './Badge.js';
import type { BadgeSize, BadgeVariant } from './Badge.types.js';

type StoryComponent = typeof Badge;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;

const sizes: BadgeSize[] = ['dot', 'sm', 'lg'];

const variants: BadgeVariant[] = ['default', 'secondary', 'critical', 'gray', 'white'];

export const Playground: Story = {
  render: Badge,
  args: {
    size: 'sm',
    variant: 'default',
    children: '99+',
  },
  argTypes: {
    size: {
      description: 'Badge size.',
      control: 'select',
      options: sizes,
      defaultValue: { summary: 'sm' },
    },
    variant: {
      description: 'Badge variant.',
      control: 'select',
      options: variants,
      defaultValue: { summary: 'default' },
    },
    children: {
      description: 'Content to place inside the badge.',
      control: 'text',
    },
    classes: getClassesArgType('root'),
  },
};

export const Preview: Story = {
  render: () => (
    <For each={variants}>
      {(variant) => (
        <div style={{ 'margin-bottom': '12px' }}>
          <div style={{ display: 'flex', 'align-items': 'center', gap: '12px' }}>
            <For each={sizes}>
              {(size) => <Badge variant={variant} size={size}>42</Badge>}
            </For>
          </div>
        </div>
      )}
    </For>
  ),
};

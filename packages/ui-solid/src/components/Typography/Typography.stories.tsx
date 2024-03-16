import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Typography as Component } from './Typography.js';
import type { TypographyType, TypographyWeight } from './Typography.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const typographyTypes: TypographyType[] = [
  'large-title',
  'title1',
  'title2',
  'title3',
  'headline',
  'text',
  'subheadline1',
  'subheadline2',
  'caption1',
  'caption2',
];

const typographyWeights: TypographyWeight[] = [
  'regular',
  'semibold',
  'bold',
];

const meta: Meta<StoryComponent> = {
  title: 'Typography',
  component: Component,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: Component,
  args: {
    children: 'Telegram Mini Apps is awesome',
    component: 'p',
    monospace: false,
    type: 'text',
    weight: 'regular',
  },
  argTypes: {
    children: {
      description: 'Content to place inside the component',
      control: { type: 'text' },
    },
    component: {
      description: 'HTML tag name. Can also be a component.',
      control: { type: 'text' },
      defaultValue: { summary: 'p' },
    },
    monospace: {
      description: 'Should component use monospace font',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    type: {
      description: 'Typography type',
      options: typographyTypes,
      control: { type: 'select' },
      defaultValue: { summary: 'text' },
    },
    weight: {
      description: 'Font weight',
      options: typographyWeights,
      control: { type: 'select' },
      defaultValue: { summary: 'regular' },
    },
    classes: getClassesArgType({
      elementKeys: ['root'],
      component: 'typography',
    }),
  },
};

export const Preview: Story = {
  render: () => {
    const formatValue = (value: string) => {
      return value
        .replace(/-/g, ' ')
        .replace(/([0-9])/g, ' $1')
        .replace(/^[a-z]/, (m) => m.toUpperCase());
    };

    return (
      <For each={typographyTypes}>
        {(typographyType) => (
          <div style={{ 'margin-bottom': '48px' }}>
            <For each={typographyWeights}>
              {(typographyWeight) => (
                <Component
                  type={typographyType}
                  weight={typographyWeight}
                  style={{ margin: '0 0 12px' }}
                >
                  {formatValue(typographyType)}&nbsp;·&nbsp;{formatValue(typographyWeight)}
                </Component>
              )}
            </For>
          </div>
        )}
      </For>
    );
  },
};

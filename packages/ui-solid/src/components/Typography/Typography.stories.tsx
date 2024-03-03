import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Typography as Component } from './Typography.js';
import type { TypographyAs, TypographyType, TypographyWeight } from './Typography.types.js';

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
  args: {
    children: 'Telegram Mini Apps is awesome',
    type: 'text',
    weight: 'regular',
    as: 'p',
    monospace: false,
  },
  argTypes: {
    type: {
      description: 'Typography type',
      options: typographyTypes,
      control: { type: 'select' },
      defaultValue: { summary: 'text' },
    },
    as: {
      description: 'HTML tag name',
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'span',
        'label',
        'p',
      ] as TypographyAs[],
      control: { type: 'select' },
      defaultValue: { summary: 'p' },
    },
    weight: {
      description: 'Font weight',
      options: typographyWeights,
      control: { type: 'select' },
      defaultValue: { summary: 'regular' },
    },
    monospace: {
      description: 'Should component use monospace font',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    children: {
      description: 'Content to place inside the component',
      type: {
        name: 'string',
        required: false,
      },
      control: {
        type: 'text',
      },
    },
    classes: getClassesArgType({
      elementKeys: ['root'],
      component: 'typography',
    }),
  },
};

export default meta;

export const Playground: Story = {
  render: Component,
};

export const Showcase: Story = {
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
                  style={{ 'margin-top': '12px' }}
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

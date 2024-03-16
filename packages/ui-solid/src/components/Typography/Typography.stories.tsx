import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Typography as Component } from './Typography.js';
import type {
  TypographyComponent,
  TypographyVariant,
  TypographyWeight,
} from './Typography.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const variants: TypographyVariant[] = [
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

const weights: TypographyWeight[] = [
  'regular',
  'semibold',
  'bold',
];

const components: TypographyComponent[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'span',
  'p',
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
    variant: 'text',
    weight: 'regular',
  },
  argTypes: {
    children: {
      description: 'Content to place inside the component',
      control: 'text',
    },
    component: {
      description: 'HTML tag name.',
      control: 'select',
      options: components,
      defaultValue: { summary: 'p' },
    },
    monospace: {
      description: 'Use monospace font.',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    variant: {
      description: 'Typography variant.',
      options: variants,
      control: 'select',
      defaultValue: { summary: 'text' },
    },
    weight: {
      description: 'Font weight.',
      options: weights,
      control: 'select',
      defaultValue: { summary: 'regular' },
    },
    classes: getClassesArgType('root'),
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
      <For each={variants}>
        {(typographyType) => (
          <div style={{ 'margin-bottom': '48px' }}>
            <For each={weights}>
              {(typographyWeight) => (
                <Component
                  variant={typographyType}
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

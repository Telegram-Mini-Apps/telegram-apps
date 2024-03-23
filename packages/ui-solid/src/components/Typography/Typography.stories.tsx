import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Typography } from './Typography.js';
import type { TypographyVariant, TypographyWeight } from './Typography.types.js';

type StoryComponent = typeof Typography;
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

const meta: Meta<StoryComponent> = {
  title: 'Typography',
  component: Typography,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: Typography,
  args: {
    children: 'Telegram Mini Apps is awesome',
    monospace: false,
    variant: 'text',
    weight: 'regular',
  },
  argTypes: {
    children: {
      description: 'Content to place inside the component. Could either be a Solid component or JSXElement.\n\n'
        + 'In case, Solid component is passed, all passed intrinsic attributes excluding the `class` property will be ignored. The Solid component will receive computed `class` property.\n\n'
        + '_By default, the component renders the `p` HTML tag._',
      control: 'text',
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
                <Typography
                  variant={typographyType}
                  weight={typographyWeight}
                  style={{ margin: '0 0 12px' }}
                >
                  {formatValue(typographyType)}&nbsp;·&nbsp;{formatValue(typographyWeight)}
                </Typography>
              )}
            </For>
          </div>
        )}
      </For>
    );
  },
};

export const CustomComponent: Story = {
  render: () => {
    return (
      <Typography
        variant={'title1'}
        weight={'bold'}
        // This style attribute will be ignored. Using custom components, specify attributes
        // directly in the returned JSX element.
        style={{ color: 'red' }}
      >
        {(props) => (
          <h1 class={props.class}>
            This content is wrapped into <code>h1</code> HTML tag.
          </h1>
        )}
      </Typography>
    );
  },
};

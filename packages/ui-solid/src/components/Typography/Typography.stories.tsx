import { For, splitProps } from 'solid-js';
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

const weights: TypographyWeight[] = ['regular', 'semibold', 'bold'];

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
      description: 'Content to place inside the component.',
      control: 'text',
    },
    // component: {
    //   description: 'Component, which could be used to override the returned content. If passed, all passed intrinsic attributes excluding the `class` property will be ignored. The Solid component will receive computed `class` and `children` properties.\n\n'
    //     + '_By default the component renders the `p` HTML tag._',
    // },
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

export const CustomComponent: Story = {
  ...Playground,
  render(props) {
    const [picked] = splitProps(props, ['weight', 'variant', 'monospace']);

    return (
      <Typography.Custom
        {...picked}
        component={(typographyProps) => (
          <h1 {...typographyProps}>
            This content is wrapped into{' '}
            <Typography.Custom
              monospace
              weight="bold"
              component={(p) => <span {...p}>h1</span>}
            />{' '}tag.
          </h1>
        )}
      />
    );
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

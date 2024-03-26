import { For, Match, Switch } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Qr28 } from '~/icons/Qr28.js';
import { Questionmark20 } from '~/icons/Questionmark20.js';
import { Sortalphabetically24 } from '~/icons/Sortalphabetically24.js';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { IconButton } from './IconButton.js';
import type {
  IconButtonSize,
  IconButtonVariant,
} from './IconButton.types.js';

type StoryComponent = typeof IconButton;
type Story = StoryObj<StoryComponent>;

const variants: IconButtonVariant[] = ['bezeled', 'plain', 'gray'];

const sizes: IconButtonSize[] = ['sm', 'md', 'lg'];

const meta: Meta<StoryComponent> = {
  title: 'IconButton',
  component: IconButton,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: IconButton,
  args: {
    children: Questionmark20,
    disabled: false,
    size: 'md',
    variant: 'bezeled',
    rounded: false,
  },
  argTypes: {
    ripples: {
      description: 'Forces button ripples.\n\n'
        + '_By default, this value is being computed depending on the current platform._',
      control: 'boolean',
    },
    classes: getClassesArgType('root', 'iconContainer', 'icon'),
    disabled: {
      description: 'Disables the button.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    children: {
      required: true,
      description: 'Icon to display. Could either be a Component having the `class?: string; size?: number` props or JSX Element.',
    },
    rounded: {
      description: 'Completely rounds the button corners.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    size: {
      description: 'IconButton size.',
      options: sizes,
      control: 'select',
      defaultValue: { summary: 'md' },
    },
    variant: {
      description: 'IconButton variant.',
      options: variants,
      control: 'select',
      defaultValue: { summary: 'bezeled' },
    },
  },
};

export const Preview: Story = {
  render() {
    return (
      <For each={variants}>
        {(variant) => (
          <div
            style={{
              'margin-bottom': '15px',
              display: 'flex',
              'align-items': 'flex-start',
              gap: '10px',
            }}
          >
            <For each={sizes}>
              {(size) => (
                <IconButton size={size} variant={variant}>
                  <Switch>
                    <Match when={size === 'sm'}>
                      <Questionmark20/>
                    </Match>
                    <Match when={size === 'md'}>
                      <Sortalphabetically24/>
                    </Match>
                    <Match when={size === 'lg'}>
                      <Qr28/>
                    </Match>
                  </Switch>
                </IconButton>
              )}
            </For>
          </div>
        )}
      </For>
    );
  },
};

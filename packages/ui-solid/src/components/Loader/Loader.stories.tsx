import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import type { Platform } from '~/types/known.js';

import { getClassesArgType } from '../../../.storybook/utils.js';
import { Loader as Component } from './Loader.js';
import type { LoaderSize } from './Loader.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const sizes: LoaderSize[] = ['sm', 'md', 'lg'];

const meta: Meta<StoryComponent> = {
  title: 'Loader',
  component: Component,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: Component,
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      description: 'Loader size.',
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
    classes: getClassesArgType('root', 'inner'),
  },
};

export const Preview: Story = {
  render() {
    const platforms: Platform[] = ['base', 'ios'];

    return (
      <div style={{ display: 'flex', margin: '0 -10px' }}>
        <For each={platforms}>
          {(platform) => (
            <div style={{ padding: '0 10px' }}>
              <For each={sizes}>
                {(size) => (
                  <Component
                    size={size}
                    platform={platform}
                    style={{ 'margin-bottom': '20px' }}
                  />
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    );
  },
};

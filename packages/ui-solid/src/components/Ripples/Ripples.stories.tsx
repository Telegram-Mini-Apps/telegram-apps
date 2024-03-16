import type { Meta, StoryObj } from 'storybook-solidjs';

import { Typography } from '~/components/Typography/Typography.js';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Ripples as Component } from './Ripples.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Ripples',
  component: Component,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render(props) {
    return (
      <Component
        {...props}
        style={{
          'background-color': '#ccc',
          'border-radius': '20px',
          width: '300px',
          height: '100px',
          display: 'flex',
          'justify-content': 'center',
        }}
      >
        <Typography
          component='p'
          style={{
            margin: 0,
            display: 'flex',
            'align-items': 'center',
            color: 'white',
            'justify-content': 'center',
            width: '200px',
            height: '100px',
            'background-color': 'forestgreen',
          }}
        >
          Click me
        </Typography>
      </Component>
    );
  },
  args: {
    centered: false,
    color: '#ffffffb3',
    disabled: false,
    overlay: false,
  },
  argTypes: {
    centered: {
      description: 'Ignores click coordinates and places ripples in the middle of the container.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    color: {
      description: 'Ripple color.',
      control: 'color',
      defaultValue: { summary: '#ffffffb3' },
    },
    disabled: {
      description: 'Disables ripples.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    radius: {
      description: 'Ripple radius in pixels. \n\n'
        + '_By default, this value equals half of the biggest container dimension._',
      control: 'number',
    },
    overlay: {
      description: 'Places ripples over the component children.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    classes: getClassesArgType('root', 'content', 'ripples', 'ripple'),
  },
};

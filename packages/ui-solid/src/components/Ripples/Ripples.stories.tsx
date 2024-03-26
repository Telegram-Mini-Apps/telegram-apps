import { splitProps } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Ripples } from '~/components/Ripples/Ripples.js';
import { Typography } from '~/components/Typography/Typography.js';

import { getClassesArgType } from '../../../.storybook/utils.js';

type StoryComponent = typeof Ripples;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Ripples',
  component: Ripples,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render(props) {
    return (
      <Ripples
        {...props}
        component={props.component || 'div'}
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
          component="h1"
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
      </Ripples>
    );
  },
  args: {
    centered: false,
    component: 'div',
    disable: false,
    overlay: false,
  },
  argTypes: {
    centered: {
      description: 'Ignores click coordinates and places ripples in the middle of the container.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    component: {
      description: 'Custom HTML tag to be used as a root element.',
      control: { type: 'text' },
      defaultValue: { summary: 'div' },
    },
    disable: {
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

export const CustomComponent: Story = {
  ...Playground,
  render(props) {
    const [picked] = splitProps(props, ['radius', 'disable', 'overlay', 'centered']);

    return (
      <Ripples {...picked} component="button">
        <span
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
          This is button
        </span>
      </Ripples>
    );
  },
};

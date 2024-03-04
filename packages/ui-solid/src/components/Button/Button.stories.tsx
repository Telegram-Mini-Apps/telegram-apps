import type { Meta, StoryObj } from 'storybook-solidjs';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Button as Component } from './Button.js';
import type { ButtonSize, ButtonType } from './Button.types.js';

type StoryComponent = typeof Component;
type Story = StoryObj<StoryComponent>;

const buttonTypes: ButtonType[] = [
  'fill',
  'bezeled',
  'plain',
  'gray',
  'outline',
  'white',
];

const buttonSizes: ButtonSize[] = [
  'sm',
  'md',
  'lg',
];

const meta: Meta<StoryComponent> = {
  title: 'Button',
  component: Component,
  tags: ['autodocs'],
  args: {
    children: 'Submit',
    disabled: false,
    fullWidth: false,
    loading: false,
    rounded: false,
    type: 'fill',
    size: 'md',
  },
  argTypes: {
    children: {
      description: 'Content to display inside the button',
      control: { type: 'text' },
    },
    size: {
      description: 'Button size',
      options: buttonSizes,
      control: { type: 'select' },
      defaultValue: { summary: 'fill' },
    },
    type: {
      description: 'Button type',
      options: buttonTypes,
      control: { type: 'select' },
      defaultValue: { summary: 'fill' },
    },
    disabled: {
      description: 'Button active state',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    fullWidth: {
      description: 'Should button use full available width',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    rounded: {
      description: 'Should button have highly rounded corners',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    loading: {
      description: 'Should button display loader inside of it',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    classes: getClassesArgType({
      elementKeys: ['root'],
      component: 'button',
    }),
  },
};

export default meta;

export const Playground: Story = {
  render: Component,
};

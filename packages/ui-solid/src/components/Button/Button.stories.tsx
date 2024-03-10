import { createMemo } from 'solid-js';
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
    icon: false,
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
    icon: {
      description: 'Icon to display before the content. Could be either a Component having the `class?: string` property, or JSX Element',
      control: { type: 'boolean' },
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
      description: 'Should component replace the icon inside with the Loader component. Enabling this property will ignore the value of the property passed in the `icon`.',
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
  render(props) {
    const icon = createMemo(() => {
      return props.icon
        ? (iconProps: { class?: string }) => (
          <svg
            class={iconProps.class}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.8388 4.69583C19.4928 4.13177 18.8737 3.83631 18.2546 3.91168C18.1243 3.92755 17.8753 4.01788 17.3621 4.38267C16.8629 4.73754 16.2305 5.26343 15.3342 6.01004L14.3211 6.85388V14.2205L15.5221 15.067C16.3961 15.683 17.0088 16.114 17.4912 16.4009C17.9828 16.6932 18.2211 16.7607 18.3519 16.7685C18.9513 16.8042 19.5336 16.4965 19.8565 15.9461C19.9317 15.8179 20.013 15.5651 20.0566 14.981C20.0994 14.407 20.1 13.641 20.1 12.5522V8.38075C20.1 7.19519 20.0994 6.35661 20.0532 5.73194C20.0058 5.09124 19.9168 4.82285 19.8388 4.69583ZM12.5211 13.7873V7.33221H6.83094C6.22328 7.33221 5.81389 7.33273 5.49653 7.355C5.18777 7.37667 5.03367 7.41572 4.92936 7.46016C4.52801 7.63115 4.20134 7.96275 4.02926 8.39006C3.98259 8.50592 3.94369 8.6728 3.92233 8.99483C3.90046 9.32447 3.9 9.74863 3.9 10.3726V11.764C3.9 12.058 3.90084 12.1478 3.90668 12.2154C3.9802 13.0666 4.62984 13.7094 5.40985 13.7807C5.47147 13.7864 5.55466 13.7873 5.84211 13.7873H12.5211ZM13.0953 5.53221L14.2127 4.60152C15.0716 3.88609 15.7569 3.31529 16.3192 2.91559C16.8741 2.52108 17.4342 2.19828 18.0371 2.12488C19.3733 1.9622 20.6685 2.60588 21.3732 3.75463C21.6892 4.2699 21.7972 4.9082 21.8483 5.59915C21.9 6.2983 21.9 7.20383 21.9 8.34238V12.5901C21.9 13.6324 21.9 14.4658 21.8516 15.1148C21.8034 15.7616 21.7011 16.3591 21.4091 16.8568C20.7528 17.9757 19.5378 18.6423 18.2449 18.5653C17.6661 18.5308 17.1187 18.2735 16.5712 17.948C16.0215 17.6211 15.3518 17.1491 14.5173 16.561L13.1358 15.5873H12.9V18.6204C12.9 20.4076 11.485 21.9 9.68653 21.9C9.07885 21.9 8.47046 21.7257 7.94961 21.3721C6.82431 20.6083 5.99142 19.9045 5.50498 18.8149C5.11564 17.9428 4.98401 16.898 4.9512 15.5334C3.41188 15.2566 2.25014 13.9538 2.11336 12.3703C2.09992 12.2147 2.09995 12.0403 2.1 11.8048C2.1 11.7914 2.1 11.7778 2.1 11.764L2.1 10.3426C2.09999 9.7561 2.09999 9.272 2.12627 8.87569C2.15352 8.46504 2.21181 8.08454 2.35956 7.71766C2.70591 6.85762 3.37361 6.16643 4.22384 5.80419C4.58888 5.64867 4.96695 5.58774 5.37052 5.55941C5.75839 5.53219 6.23126 5.5322 6.79962 5.53221L13.0953 5.53221ZM6.75376 15.5873C6.78939 16.8215 6.90924 17.5449 7.14862 18.0811C7.42081 18.6908 7.8944 19.1591 8.96053 19.8828C9.16839 20.0239 9.4211 20.1 9.68653 20.1C10.4434 20.1 11.1 19.4617 11.1 18.6204V15.5873H6.75376Z"
              fill="currentColor"
            />
          </svg>
        )
        : undefined;
    });

    return <Component {...props} icon={icon()}/>;
  },
};

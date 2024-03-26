import { createMemo } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Typography } from '~/components/Typography/Typography.js';

import { Channel24 } from '~/icons/Channel24.js';

import { getClassesArgType } from '../../../.storybook/utils.js';

import { Button } from './Button.js';
import type { ButtonSize, ButtonVariant } from './Button.types.js';

type StoryComponent = typeof Button;
type Story = StoryObj<StoryComponent>;

const variants: ButtonVariant[] = [
  'fill',
  'bezeled',
  'plain',
  'gray',
  'outline',
  'white',
];

const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

const meta: Meta<StoryComponent> = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

// export const Preview: Story = {
//   render() {
//     const variations: ButtonProps[] = [
//       {},
//       { disabled: true, children: 'Disabled' },
//       { loading: true },
//     ];
//
//     return (
//       <For each={variants}>
//         {(variant) => (
//           <div style={{ 'margin-bottom': '80px' }}>
//             <For each={variations}>
//               {(variation) => (
//                 <For each={sizes}>
//                   {(size) => (
//                     <Button variant={variant} size={size} {...variation}>
//                       Action
//                     </Button>
//                   )}
//                 </For>
//               )}
//             </For>
//           </div>
//         )}
//       </For>
//     );
//   },
// };

export const Playground: Story = {
  render(props) {
    const icon = createMemo(() => {
      return props.icon
        ? Channel24
        : undefined;
    });

    const before = createMemo(() => {
      return props.before && <Typography>I am before!</Typography>;
    });

    const after = createMemo(() => {
      return props.after && <Typography>I am after!</Typography>;
    });

    return (
      <Button
        {...props}
        icon={icon()}
        before={before()}
        after={after()}
      />
    );
  },
  args: {
    after: false,
    before: false,
    children: 'Submit',
    disabled: false,
    icon: false,
    loading: false,
    rounded: false,
    size: 'md',
    stretched: false,
    variant: 'fill',
  },
  argTypes: {
    after: {
      description: 'Content to display after the main content. Any JSX element or component.',
      control: 'boolean',
    },
    before: {
      description: 'Content to display between the icon and main content. Any JSX element or component.',
      control: 'boolean',
    },
    children: {
      description: 'Content to display inside the button. Any JSX element allowed.',
      control: 'text',
    },
    ripples: {
      description: 'Forces button ripples.\n\n'
        + '_By default, this value is being computed depending on the current platform._',
      control: 'boolean',
    },
    classes: getClassesArgType('root', 'content', 'loader', 'iconContainer', 'icon'),
    disabled: {
      description: 'Disables the button.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    icon: {
      description: 'Icon to display before the content. Could be either a Component having the `class?: string` property, or JSX Element.',
      control: 'boolean',
    },
    loading: {
      description: 'Replaces the icon inside with the Loader component. Enabling this property will ignore the value of the property passed in the `icon`.',
      control: { type: 'boolean' },
      defaultValue: { summary: false },
    },
    rounded: {
      description: 'Completely rounds the button corners.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    size: {
      description: 'Button size.',
      options: sizes,
      control: 'select',
      defaultValue: { summary: 'md' },
    },
    stretched: {
      description: 'Stretches the button horizontally.',
      control: 'boolean',
      defaultValue: { summary: false },
    },
    variant: {
      description: 'Button variant.',
      options: variants,
      control: 'select',
      defaultValue: { summary: 'fill' },
    },
  },
};

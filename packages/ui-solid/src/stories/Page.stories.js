import { within, userEvent } from '@storybook/testing-library';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/solid/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
export const LoggedOut = {};

// More on interaction testing: https://storybook.js.org/docs/7.0/solid/writing-tests/interaction-testing
export const LoggedIn = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', {
      name: /Log in/i,
    });
    await userEvent.click(loginButton);
  },
};

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { ConfigProvider } from '../src/providers/ConfigProvider/ConfigProvider';

// Allowed icons:
// https://www.npmjs.com/package/@storybook/icons
// https://main--64b56e737c0aeefed9d5e675.chromatic.com/

/** @type { import('storybook-solidjs').Preview } */
const preview = {
  globalTypes: {
    colorScheme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Color scheme',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },

    platform: {
      description: 'Current platform',
      defaultValue: 'base',
      toolbar: {
        title: 'Platform',
        icon: 'mobile',
        items: [
          { value: 'base', title: 'Base', icon: 'windows' },
          { value: 'ios', title: 'iOS', icon: 'apple' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      // https://storybook.js.org/docs/essentials/controls#specify-initial-preset-color-swatches
      // presetColors: [{ color: '#ff4785', title: 'Coral' }, 'rgba(0, 159, 183, 1)', '#fe4a49'],
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      // https://storybook.js.org/docs/essentials/controls#sorting-controls
      controls: {
        sort: 'requiredFirst',
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },

  decorators: [
    (Story, context) => {
      const { colorScheme, platform } = context.globals;
      // colorScheme dark 333333

      return (
        <ConfigProvider platform={platform} colorScheme={colorScheme}>
          <Story/>
        </ConfigProvider>
      );
    },
  ],
};

export default preview;

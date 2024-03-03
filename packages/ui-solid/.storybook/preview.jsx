import { ConfigProvider } from '../src/providers';

// Allowed icons:
// https://storybook.js.org/docs/7.0/faq#what-icons-are-available-for-my-toolbar-or-my-addon

/** @type { import('storybook-solidjs').Preview } */
const preview = {
  globalTypes: {
    colorScheme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Color scheme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
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
          { value: 'base', title: 'Base' },
          { value: 'ios', title: 'IOS' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const { colorScheme, platform } = context.globals;

      return (
        <ConfigProvider platform={platform} colorScheme={colorScheme}>
          <Story/>
        </ConfigProvider>
      );
    },
  ],
};

export default preview;

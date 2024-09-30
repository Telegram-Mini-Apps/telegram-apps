/* @refresh reload */
import { render } from 'solid-js/web';
import { retrieveLaunchParams } from '@telegram-apps/sdk-solid';

import './index.css';

import { Root } from '@/components/Root.js';
import { init } from '@/init.js';

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
// import './mockEnv.ts';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// Configure all application dependencies.
init(retrieveLaunchParams().startParam === 'debug');

render(() => (<Root/>), root!);


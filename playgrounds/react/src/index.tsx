import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root';
import { init } from '@/init.ts';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

// Check if debug mode is enabled.
const debug = retrieveLaunchParams().startParam === 'debug';

// Configure all application dependencies.
init(debug);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root/>
  </StrictMode>,
);

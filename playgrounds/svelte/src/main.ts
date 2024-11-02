import './index.css';

import { mount } from 'svelte'
import App from './App.svelte';
import { retrieveLaunchParams } from '@telegram-apps/sdk-svelte';
import { init } from './init';

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
// import './mockEnv.ts';

init(retrieveLaunchParams().startParam === 'debug');

const app = mount(App, { 
    target: document.getElementById('app') as Document | Element | ShadowRoot
});


export default app;
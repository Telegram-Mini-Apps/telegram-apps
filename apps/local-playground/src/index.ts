/**
 * You can import any code from other packages here. There are currently 2 shortcuts:
 *
 * 1. "@packages/*". Provides access to "packages" directory:
 * import { postEvent } from '@packages/sdk/src/index.js';
 *
 * 2. "@/*". Provides easy access to packages' index files:
 * import { postEvent } from '@/sdk';
 */

// import { initBackButton } from '@/sdk';
//
// const bb = initBackButton();
//
// // setDebug(true);
//
// bb.show();
//
// // on('main_button_pressed', console.warn);


import { setDebug } from '@packages/sdk/src/debug/debug.js';
import { postEvent } from '@packages/sdk/src/mini-apps/methods/postEvent.js';
// import { on } from '@packages/sdk/src/mini-apps/events/listening/on.js';

setDebug(true);

postEvent('web_app_setup_back_button', { is_visible: true, });
postEvent('web_app_setup_settings_button', { is_visible: true, });
// on('back_button_pressed', console.warn);

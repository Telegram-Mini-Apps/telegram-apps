import { on } from '~/bridge/index.js';

/**
 * Creates style html element which contains styles sent from the Telegram application.
 */
export function catchCustomStyles(): void {
  const element = document.createElement('style');
  element.id = 'telegram-custom-styles';
  document.head.appendChild(element);

  on('set_custom_style', (html) => {
    // It is safe to use innerHTML here as long as style tag has a special behavior related
    // to the specified content. In case, any script will be passed here, it will not be
    // executed.
    element.innerHTML = html;
  });
}

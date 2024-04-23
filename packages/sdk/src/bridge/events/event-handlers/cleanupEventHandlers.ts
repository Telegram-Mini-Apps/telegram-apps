/**
 * Removes global event handlers, used by the package.
 */
export function cleanupEventHandlers(): void {
  ['TelegramGameProxy_receiveEvent', 'TelegramGameProxy', 'Telegram'].forEach((prop) => {
    delete window[prop as keyof Window];
  });
}
